import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf';
import { sha256 } from '@noble/hashes/sha2';
import { gcm } from '@noble/ciphers/aes';
import { randomBytes } from 'node:crypto';

const bytesToHex = (bytes) => Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

const getRandomBytes = (length) => new Uint8Array(randomBytes(length));

function deriveServerPublicKey(apiKey) {
  const encoder = new TextEncoder();
  const salt = encoder.encode('d4319ca6ff9d272fe488a2e86344e116ad3eedc7f92fe6f90110d159bc64b980');
  const info = encoder.encode('asl-x25519-derivation-v1');
  const keyMaterial = encoder.encode(apiKey);

  const serverPrivateSeed = hkdf(sha256, keyMaterial, salt, info, 32);
  return ed25519.getPublicKey(serverPrivateSeed);
}

function prepareAslPayload(apiKey, plaintextMessage) {
  const clientPrivateKeyBytes = x25519.utils.randomPrivateKey();
  const clientPublicKeyBytes = x25519.getPublicKey(clientPrivateKeyBytes);
  const clientPublicKeyHex = bytesToHex(clientPublicKeyBytes);

  const serverEd25519PublicKeyBytes = deriveServerPublicKey(apiKey);

  // Convert Ed25519 public key to X25519 pubkey
  const serverX25519PublicKeyBytes = ed25519.utils.getExtendedPublicKey(serverEd25519PublicKeyBytes);

  const sharedSecret = x25519.getSharedSecret(clientPrivateKeyBytes, serverX25519PublicKeyBytes);

  const iv = getRandomBytes(12);
  const aesInstance = gcm(sharedSecret, iv);
  const encryptedBytes = aesInstance.encrypt(new TextEncoder().encode(plaintextMessage));

  const tagSize = 16;
  const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - tagSize);
  const authTagBytes = encryptedBytes.slice(encryptedBytes.length - tagSize);

  return {
    clientPublicKeyHex,
    encryptedFrame: {
      ivHex: bytesToHex(iv),
      ciphertextHex: bytesToHex(ciphertextBytes),
      authTagHex: bytesToHex(authTagBytes),
    }
  };
}

async function performHandshake(apiKey) {
  const handshakePayload = prepareAslPayload(apiKey, 'init_handshake_session');

  const res = await fetch('http://localhost:3000/auth/asl-handshake', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey
    },
    body: JSON.stringify({ clientPublicKeyHex: handshakePayload.clientPublicKeyHex })
  });

  const data = await res.json();
  if (res.ok) {
    console.log('Session ID successfully generated:', data.sessionId);
    console.log('Server public key (hex):', data.serverPublicKeyHex);
    return { sessionId: data.sessionId, serverPublicKeyHex: data.serverPublicKeyHex };
  } else {
    throw new Error(`Handshake failure: ${data.error || JSON.stringify(data)}`);
  }
}

async function main() {
  const apiKey = process.argv[2] || process.env.ASL_API_KEY;
  if (!apiKey) {
    console.error('Usage: node scripts/test-asl-handshake.mjs <API_KEY>');
    process.exit(1);
  }

  try {
    await performHandshake(apiKey);
  } catch (err) {
    console.error('Handshake error:', err);
    process.exit(2);
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('test-asl-handshake.mjs')) {
  main();
}
