import { createHmac, diffieHellman, generateKeyPairSync, createPublicKey, hkdfSync } from 'node:crypto';
import {
  deriveAslMacKey,
  generateAslClientKeyPair,
} from './aslEcdh';
import {
  canonicalizeForSigning,
  signConfigPayload,
  verifyConfigPayloadSignature,
} from './signPayload';
import { performAslHandshake } from './handshake';

const HKDF_INFO = 'flagmint-asl-config-sync-mac-v1';

function exportRawX25519PublicKey(publicKey: ReturnType<typeof generateKeyPairSync>['publicKey']): Buffer {
  const jwk = publicKey.export({ format: 'jwk' }) as { x?: string };
  return Buffer.from(jwk.x!, 'base64url');
}

function importRawX25519PublicKey(raw: Buffer) {
  return createPublicKey({
    key: {
      kty: 'OKP',
      crv: 'X25519',
      x: raw.toString('base64url'),
    },
    format: 'jwk',
  });
}

/** Mirror of FF-EU `performAslKeyAgreement` for cross-runtime parity tests. */
function serverAgree(clientPublicKeyHex: string) {
  const clientRaw = Buffer.from(clientPublicKeyHex, 'hex');
  const { publicKey: serverPublicKey, privateKey: serverPrivateKey } = generateKeyPairSync('x25519');
  const shared = diffieHellman({
    privateKey: serverPrivateKey,
    publicKey: importRawX25519PublicKey(clientRaw),
  });
  const salt = Buffer.from('0123456789abcdef0123456789abcdef', 'hex');
  const configMacKey = Buffer.from(hkdfSync('sha256', shared, salt, HKDF_INFO, 32));
  return {
    serverPublicKeyHex: exportRawX25519PublicKey(serverPublicKey).toString('hex'),
    saltHex: salt.toString('hex'),
    configMacKey,
  };
}

describe('ASL ECDH + MAC verify', () => {
  it('derives the same MAC key as Node (API) without sharing the secret', () => {
    const client = generateAslClientKeyPair();
    const server = serverAgree(client.publicKeyHex);
    const { configMacKey } = deriveAslMacKey({
      privateKey: client.privateKey,
      peerPublicKeyHex: server.serverPublicKeyHex,
      saltHex: server.saltHex,
    });
    expect(Buffer.from(configMacKey).equals(server.configMacKey)).toBe(true);
  });

  it('verifies lease payloads signed with the derived MAC key', () => {
    const client = generateAslClientKeyPair();
    const server = serverAgree(client.publicKeyHex);
    const { configMacKey } = deriveAslMacKey({
      privateKey: client.privateKey,
      peerPublicKeyHex: server.serverPublicKeyHex,
      saltHex: server.saltHex,
    });

    const unsigned = {
      type: 'lease',
      version: 7,
      serverNow: 1_700_000_000_000,
      expiresAt: 1_700_000_000_000 + 86_400_000,
    };
    const signature = createHmac('sha256', server.configMacKey)
      .update(canonicalizeForSigning(unsigned))
      .digest('hex');
    const lease = { ...unsigned, signature };

    expect(verifyConfigPayloadSignature(lease, configMacKey)).toBe(true);
    expect(verifyConfigPayloadSignature(lease, 'jwt-fallback-secret')).toBe(false);
  });

  it('rejects tampered payloads', () => {
    const mac = new Uint8Array(32).fill(9);
    const expiresAt = Date.now() + 60_000;
    const unsigned = {
      type: 'fullConfig',
      version: 1,
      compiledAt: 1,
      expiresAt,
      flags: [],
      segments: {},
    };
    const body = {
      ...unsigned,
      signature: signConfigPayload(unsigned, mac),
    };
    expect(verifyConfigPayloadSignature(body, mac)).toBe(true);
    const tampered = { ...body, version: 99 };
    expect(verifyConfigPayloadSignature(tampered, mac)).toBe(false);
  });

  it('performAslHandshake sends clientPublicKey and derives MAC when withEcdh', async () => {
    const fetchImpl = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body || '{}')) as { clientPublicKey?: string };
      expect(body.clientPublicKey).toMatch(/^[0-9a-f]{64}$/);
      const server = serverAgree(body.clientPublicKey!);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            sessionId: 'fm_asl_test',
            serverPublicKey: server.serverPublicKeyHex,
            salt: server.saltHex,
            keyAgreement: 'x25519-hkdf-sha256',
          },
        }),
      } as Response;
    });

    const result = await performAslHandshake({
      handshakeUrl: 'http://localhost/auth/asl-handshake',
      apiKey: 'ff_test',
      withEcdh: true,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result.sessionId).toBe('fm_asl_test');
    expect(result.configMacKey?.length).toBe(32);
  });

  it('performAslHandshake stays legacy without ECDH', async () => {
    const fetchImpl = jest.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.body).toBeUndefined();
      return {
        ok: true,
        status: 200,
        json: async () => ({ data: { sessionId: 'fm_asl_legacy' } }),
      } as Response;
    });

    const result = await performAslHandshake({
      handshakeUrl: 'http://localhost/auth/asl-handshake',
      apiKey: 'ff_test',
      withEcdh: false,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result.sessionId).toBe('fm_asl_legacy');
    expect(result.configMacKey).toBeUndefined();
  });

  it('performAslHandshake rejects unsupported keyAgreement', async () => {
    const fetchImpl = jest.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body || '{}')) as { clientPublicKey?: string };
      const server = serverAgree(body.clientPublicKey!);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            sessionId: 'fm_asl_test',
            serverPublicKey: server.serverPublicKeyHex,
            salt: server.saltHex,
            keyAgreement: 'something-else',
          },
        }),
      } as Response;
    });

    await expect(
      performAslHandshake({
        handshakeUrl: 'http://localhost/auth/asl-handshake',
        apiKey: 'ff_test',
        withEcdh: true,
        fetchImpl: fetchImpl as unknown as typeof fetch,
      }),
    ).rejects.toMatchObject({ code: 'ERR_HANDSHAKE' });
  });
});
