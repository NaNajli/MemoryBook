import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomBytes, createHash } from 'node:crypto';
import ts from 'typescript';
import { hash, compare } from 'bcryptjs';
import * as jsxRuntime from 'react/jsx-runtime';

async function load(path, deps) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)(name => {
    if (!(name in deps)) throw new Error(`Unexpected dependency: ${name}`);
    return deps[name];
  }, exports);
  return exports;
}
const cookieValues = new Map();
const sessions = new Map();
let cookieOptions;
const passwordHash = await hash('correct-password', 10);
const users = [{ id: 42, email: 'owner@example.com', password_hash: passwordHash }];
const pool = { async query(sql, args = []) {
  if (sql.startsWith('CREATE TABLE')) return { rows: [] };
  if (sql.includes('DELETE FROM auth_sessions WHERE expires_at')) {
    for (const [key, row] of sessions) if (row.expires_at <= new Date()) sessions.delete(key);
  } else if (sql.includes('DELETE FROM auth_sessions')) sessions.delete(args[0]);
  else if (sql.includes('INSERT INTO auth_sessions')) sessions.set(args[0], { user_id: args[1], expires_at: args[2] });
  else if (sql.includes('SELECT user_id FROM auth_sessions')) {
    const row = sessions.get(args[0]);
    return { rows: row && row.expires_at > new Date() ? [row] : [] };
  } else if (sql.includes('FROM users')) return { rows: users.filter(user => user.email.toLowerCase() === args[0].toLowerCase()) };
  else if (sql.includes('INSERT INTO users')) {
    const user = { id: 43, name: args[0], email: args[1], password_hash: args[2] };
    users.push(user); return { rows: [{ id: user.id, name: user.name, email: user.email }] };
  } else throw new Error(`Unexpected SQL: ${sql}`);
  return { rows: [] };
} };
const session = await load('../lib/session.ts', {
  'node:crypto': { randomBytes, createHash }, '@/lib/db': { default: pool },
  'next/headers': { cookies: async () => ({
    get: key => cookieValues.has(key) ? { value: cookieValues.get(key) } : undefined,
    set: (key, value, options) => { cookieValues.set(key, value); cookieOptions = options; },
    delete: key => cookieValues.delete(key),
  }) },
});
const deps = { bcryptjs: { compare, hash }, '@/lib/db': { default: pool }, '@/lib/session': session };
const login = await load('../app/api/auth/login/route.ts', deps);
const register = await load('../app/api/auth/register/route.ts', deps);
const logout = await load('../app/api/auth/logout/route.ts', deps);
const request = (body, origin = 'https://memorybook.example') => new Request('https://memorybook.example/api/auth/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: JSON.stringify(body),
});
assert.equal(await session.getSessionUserId(), null);
assert.equal((await login.POST(request({ email: 'owner@example.com', password: 'wrong' }))).status, 401);
assert.equal((await login.POST(request({ email: 'missing@example.com', password: 'correct-password' }))).status, 401);
assert.equal((await login.POST(request({ email: 'owner@example.com', password: 'correct-password' }, 'https://attacker.example'))).status, 403);
assert.equal((await login.POST(request({}))).status, 400);
process.env.NODE_ENV = 'production';
const loggedIn = await login.POST(request({ email: 'OWNER@example.com', password: 'correct-password' }));
assert.equal(loggedIn.status, 200);
assert.equal((await loggedIn.json()).redirectTo, '/dashboard/42');
assert.equal(await session.getSessionUserId(), 42);
assert.equal(cookieOptions.httpOnly, true);
assert.equal(cookieOptions.secure, true);
assert.equal(cookieOptions.sameSite, 'lax');
const validToken = cookieValues.get('memory_book_session');
assert.equal(sessions.has(validToken), false); // Raw credential is never persisted.
cookieValues.set('memory_book_session', 'a'.repeat(64));
assert.equal(await session.getSessionUserId(), null);
cookieValues.set('memory_book_session', validToken);
for (const row of sessions.values()) row.expires_at = new Date(0);
assert.equal(await session.getSessionUserId(), null);
await login.POST(request({ email: 'owner@example.com', password: 'correct-password' }));
const beforeRotation = cookieValues.get('memory_book_session');
await login.POST(request({ email: 'owner@example.com', password: 'correct-password' }));
assert.notEqual(cookieValues.get('memory_book_session'), beforeRotation);
assert.equal(sessions.size, 1);
assert.equal((await logout.POST(request({}))).status, 200);
assert.equal(await session.getSessionUserId(), null);
assert.equal(sessions.size, 0);
assert.equal((await register.POST(request({ name: 'Owner', email: 'OWNER@example.com', password: 'password' }))).status, 409);
const created = await register.POST(request({ name: ' New Owner ', email: 'NEW@example.com', password: 'new-password' }));
assert.equal(created.status, 201);
assert.equal((await created.json()).password_hash, undefined);
assert.equal(users[1].email, 'new@example.com');
assert.equal(await compare('new-password', users[1].password_hash), true);
const secondLogin = await login.POST(request({ email: 'new@example.com', password: 'new-password' }));
assert.equal((await secondLogin.json()).redirectTo, '/dashboard/43');
assert.equal(await session.getSessionUserId(), 43);
console.log('PASS: bcrypt credentials, per-user redirects, registration, HttpOnly/Secure cookies, expiry, tampering, rotation, logout, and cross-origin rejection. Database and cookies mocked.');

const currentUser = await load('../lib/currentUser.ts', {
  '@/lib/session': session,
  'next/navigation': { redirect: path => { throw new Error(`redirect:${path}`); } },
});
assert.equal(await currentUser.getCurrentUserId(), 43);
await session.deleteSession();
await assert.rejects(currentUser.getCurrentUserId(), /redirect:\/login/);

const dashboard = await load('../app/dashboard/[userId]/page.tsx', {
  'react/jsx-runtime': jsxRuntime,
  '@/lib/currentUser': { getCurrentUserId: async () => 42 },
  'next/navigation': { notFound: () => { throw new Error('not-found'); } },
  'next/server': { connection: async () => {} },
  '@/lib/db': { default: { query: async (_sql, [id]) => {
    assert.equal(id, 42); return { rows: [{ name: 'Owner' }] };
  } } },
  '@/lib/bookCollection': { loadBookCollection: async id => {
    assert.equal(id, 42); return { books: [], error: false };
  } },
  '../../components/dashboard/BooksCard': { default: () => null },
  '../../components/dashboard/DashboardTabs': { default: () => null },
  '../../components/dashboard/InviteCard': { default: () => null },
  '../../components/navigation/Navigation': { default: () => null },
});
await assert.rejects(dashboard.default({ params: Promise.resolve({ userId: '43' }) }), /not-found/);
assert.ok(await dashboard.default({ params: Promise.resolve({ userId: '42' }) }));
console.log('PASS: owner dashboard renders only for the session user; logged-out owner routes redirect to login.');
