// const { asl } = require('../dist/flagmint.cjs.js');

async function performHandshake(apiKey) {
  // Generate the unique client ephemeral keys and secure payloads
  // const handshakePayload = asl.prepareAslPayload(apiKey, 'init_handshake_session');

  // Use Node's built-in global fetch API (No imports needed!)
  const res = await fetch('http://localhost:3000/auth/asl-handshake', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey
    },
  });

  const data = await res.json();
  console.log('Handshake response:', data, apiKey);
  if (res.ok) {
    console.log('\x1b[32m%s\x1b[0m', '✔ Handshake Successful!');
    console.log('Session ID:', data.data.sessionId);
    return { sessionId: data.data.sessionId };
  } else {
    throw new Error(`Handshake failure: ${data.error || JSON.stringify(data)}`);
  }
}

async function main() {
  const apiKey = process.argv[2] || process.env.ASL_API_KEY;
  if (!apiKey) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: API key is required.');
    console.error('Usage: npm run simulate:asl-gen -- <YOUR_API_KEY>');
    process.exit(1);
  }

  try {
    await performHandshake(apiKey);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Handshake error:', err.message || err);
    process.exit(2);
  }
}

main();
