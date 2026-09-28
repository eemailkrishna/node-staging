import { spawn } from 'node:child_process';

const PORT = process.env.PORT || 3457;
const base = `http://localhost:${PORT}`;

const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'inherit',
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function check(path, expectedStatus, expectedBody) {
  const res = await fetch(`${base}${path}`);
  const body = await res.text();
  if (res.status !== expectedStatus) {
    throw new Error(`${path}: expected status ${expectedStatus}, got ${res.status} (${body})`);
  }
  if (expectedBody && !body.includes(expectedBody)) {
    throw new Error(`${path}: expected body to include ${expectedBody}, got ${body}`);
  }
  console.log(`ok ${path} -> ${body}`);
}

try {
  await wait(1500);
  await check('/hello', 200, 'Hello, World!');
  await check('/hello?name=Node', 200, 'Hello, Node!');
  await check('/', 200, 'Hello API running');
  console.log('smoke test passed');
  process.exitCode = 0;
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  server.kill();
}
