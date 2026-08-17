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
    delay: async () => undefined,
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

  it('ignores a malformed flags broadcast instead of wiping the follower snapshot', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);

    await leader.join();
    await follower.join();
    leader.broadcastFlags({ featureA: true });

    const transport = follower.createFollowerTransport();
    const received: Array<Record<string, unknown>> = [];
    transport.onFlagsUpdated?.((flags) => received.push(flags));
    await transport.init();

    const rogue = new MemoryChannel('flagmint-share:ff_test');
    rogue.postMessage({ type: 'flags', memberId: 'rogue' });
    rogue.postMessage({ type: 'flags', memberId: 'rogue', flags: ['not', 'an', 'object'] });
    rogue.close();

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
    const receivedOptions: Array<{ persist?: boolean } | undefined> = [];
    leader.setLeaderContextHandler(async (context, fetchOptions) => {
      expect(context).toEqual({ site: 'abc' });
      receivedOptions.push(fetchOptions);
      return { allow_scheduling_by_participant: true };
    });

    const transport = follower.createFollowerTransport();
    await expect(
      transport.fetchFlags({ site: 'abc' }, { persist: false })
    ).resolves.toEqual({
      allow_scheduling_by_participant: true,
    });
    await expect(
      transport.fetchFlags({ site: 'abc' }, { persist: true })
    ).resolves.toEqual({
      allow_scheduling_by_participant: true,
    });
    expect(receivedOptions).toEqual([{ persist: false }, { persist: true }]);

    leader.destroy();
    follower.destroy();
  });

  it('promotes a follower when the leader releases the lock', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);
    const promoted = jest.fn();

    await leader.join();
    follower.onPromote(promoted);
    await follower.join();

    leader.destroy();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(promoted).toHaveBeenCalledTimes(1);
    expect(follower.currentRole).toBe('leader');

    follower.destroy();
  });

  it('promotes only one follower when the leader leaves', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const first = new ConnectionShareHub('ff_test', options);
    const second = new ConnectionShareHub('ff_test', options);
    const promotedFirst = jest.fn();
    const promotedSecond = jest.fn();

    await leader.join();
    first.onPromote(promotedFirst);
    second.onPromote(promotedSecond);
    await first.join();
    await second.join();

    leader.destroy();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(promotedFirst.mock.calls.length + promotedSecond.mock.calls.length).toBe(1);
    expect([first.currentRole, second.currentRole].filter((role) => role === 'leader')).toHaveLength(1);

    first.destroy();
    second.destroy();
  });

  it('retries takeover after a failed promotion', async () => {
    const options = shareOptions();
    const leader = new ConnectionShareHub('ff_test', options);
    const follower = new ConnectionShareHub('ff_test', options);
    let attempts = 0;
    follower.onPromote(async () => {
      attempts += 1;
      if (attempts === 1) throw new Error('setup failed');
    });

    await leader.join();
    await follower.join();
    leader.destroy();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(follower.currentRole).toBe('follower');
    expect(attempts).toBe(1);

    options.tickTimers();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(attempts).toBe(2);
    expect(follower.currentRole).toBe('leader');

    follower.destroy();
  });
});
