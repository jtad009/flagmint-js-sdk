import { ConnectionShareHub } from './connectionShare';

class MemoryChannel {
  static buses = new Map<string, Set<MemoryChannel>>();
  onmessage: ((event: { data: unknown }) => void) | null = null;

  constructor(public name: string) {
    if (!MemoryChannel.buses.has(name)) {
      MemoryChannel.buses.set(name, new Set());
    }
    MemoryChannel.buses.get(name)!.add(this);
  }

  static reset() {
    MemoryChannel.buses.clear();
  }

  postMessage(data: unknown) {
    for (const channel of MemoryChannel.buses.get(this.name) ?? []) {
      if (channel !== this) {
        channel.onmessage?.({ data });
      }
    }
  }

  close() {
    MemoryChannel.buses.get(this.name)?.delete(this);
  }
}

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

function shareOptions(storage = memoryStorage(), now = { t: 1_000 }) {
  const timers: Array<{ id: number; handler: () => void }> = [];
  let nextId = 1;
  return {
    storage,
    now: () => now.t,
    channelFactory: (name: string) => new MemoryChannel(name),
    setTimer: (handler: () => void) => {
      const id = nextId++;
      timers.push({ id, handler });
      return id as unknown as ReturnType<typeof setInterval>;
    },
    clearTimer: (id: ReturnType<typeof setInterval>) => {
      const index = timers.findIndex((timer) => timer.id === (id as unknown as number));
      if (index >= 0) timers.splice(index, 1);
    },
    tickTimers: () => {
      [...timers].forEach((timer) => timer.handler());
    },
    advance: (ms: number) => {
      now.t += ms;
    },
  };
}

describe('ConnectionShareHub', () => {
  beforeEach(() => {
    MemoryChannel.reset();
  });

  it('elects the first joiner as leader and the second as follower', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);

    await expect(leader.join()).resolves.toBe('leader');
    await expect(follower.join()).resolves.toBe('follower');

    leader.destroy();
    follower.destroy();
  });

  it('sends the leader snapshot to a follower without opening a second stream', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);

    await leader.join();
    leader.broadcastFlags({ featureA: true });

    await follower.join();
    const transport = follower.createFollowerTransport();
    const received: Array<Record<string, unknown>> = [];
    transport.onFlagsUpdated?.((flags) => received.push(flags));
    await transport.init();

    expect(received).toEqual([{ featureA: true }]);

    leader.destroy();
    follower.destroy();
  });

  it('forwards follower context updates through the leader', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);

    await leader.join();
    await follower.join();
    leader.setLeaderContextHandler(async (context) => {
      expect(context).toEqual({ site: 'abc' });
      return { allow_scheduling_by_participant: true };
    });

    const transport = follower.createFollowerTransport();
    await expect(transport.fetchFlags({ site: 'abc' })).resolves.toEqual({
      allow_scheduling_by_participant: true,
    });

    leader.destroy();
    follower.destroy();
  });

  it('promotes a follower when the leader releases the lock', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);
    const promoted = jest.fn();

    await leader.join();
    await follower.join();
    follower.onPromote(promoted);

    leader.destroy();
    options.tickTimers();

    expect(promoted).toHaveBeenCalledTimes(1);
    expect(follower.currentRole).toBe('leader');

    follower.destroy();
  });
});
