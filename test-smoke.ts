import { spawn, type ChildProcess } from 'node:child_process';

const PORT = process.env.PORT ?? '3457';
const base = `http://localhost:${PORT}`;

const server: ChildProcess = spawn('node', ['dist/server.js'], {
  env: { ...process.env, PORT },
  stdio: 'inherit',
});

const wait = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function check(
  method: string,
  path: string,
  expectedStatus: number,
  expectedBody: string | null,
  body?: Record<string, unknown>,
): Promise<any> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (res.status !== expectedStatus) {
    throw new Error(`${method} ${path}: expected status ${expectedStatus}, got ${res.status} (${text})`);
  }
  if (expectedBody && !text.includes(expectedBody)) {
    throw new Error(`${method} ${path}: expected body to include ${expectedBody}, got ${text}`);
  }
  console.log(`ok ${method} ${path} -> ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

try {
  await wait(1500);
  // hello (backwards compat)
  await check('GET', '/hello', 200, 'Hello, World!');
  await check('GET', '/hello?name=Node', 200, 'Hello, Node!');
  await check('GET', '/', 200, 'Hello API running');

  // users CRUD
  const empty = await check('GET', '/api/users', 200, 'data');
  if (empty.data.length !== 0) throw new Error('expected empty users list at start');

  const created = await check('POST', '/api/users', 201, 'Ada', {
    name: 'Ada',
    email: 'ada@example.com',
  });
  const id = created.data.id as number;

  await check('GET', `/api/users/${id}`, 200, 'ada@example.com');
  await check('PUT', `/api/users/${id}`, 200, 'Ada Lovelace', {
    name: 'Ada Lovelace',
  });
  await check('DELETE', `/api/users/${id}`, 204, null);
  await check('GET', `/api/users/${id}`, 404, 'User not found');

  console.log('smoke test passed');
  process.exitCode = 0;
} catch (err) {
  console.error((err as Error).message);
  process.exitCode = 1;
} finally {
  server.kill();
}
