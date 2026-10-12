import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

async function load(path, dependencies, exports) {
  const source = (await readFile(new URL(path, import.meta.url), "utf8"))
    .replace(/^import .*;\n/gm, "").replace(/export /g, "");
  return new Function(...Object.keys(dependencies),
    `${stripTypeScriptTypes(source)}; return { ${exports} };`)(...Object.values(dependencies));
}
const tokens = new Map();
const pool = { async query(sql, args) {
  if (sql.includes("INSERT INTO share_links")) {
    if (!tokens.has(args[0])) tokens.set(args[0], args[1]);
    return { rows: [{ token: tokens.get(args[0]) }] };
  }
  if (sql.includes("SELECT user_id FROM share_links")) {
    const match = [...tokens].find(([, token]) => token === args[0]);
    return { rows: match ? [{ user_id: match[0] }] : [] };
  }
  throw new Error("Unexpected query");
} };
const links = await load("../lib/shareLinks.ts", { pool, randomBytes, getCurrentUserId: () => 1 },
  "getOrCreateShareToken, resolveShareToken, resolveCollectionUser");
const token = await links.getOrCreateShareToken(42);
assert.match(token, /^[0-9a-f]{64}$/);
assert.equal(await links.getOrCreateShareToken(42), token);
assert.notEqual(await links.getOrCreateShareToken(43), token);
assert.equal(await links.resolveShareToken(token), 42);
for (const invalid of ["42", "", [], "a".repeat(64), token.slice(1)]) {
  assert.equal(await links.resolveShareToken(invalid), null);
}
let owner;
const client = { async query(sql, args) {
  if (sql.includes("SELECT id FROM users")) return { rows: [{ id: args[0] }] };
  if (sql.includes("FROM memory_books")) { owner = args[0]; return { rows: [{ id: 7 }] }; }
  if (sql.includes("INSERT INTO memories")) return { rows: [{ id: 9 }] };
  return { rows: [] };
}, release() {} };
const { POST } = await load("../app/api/memories/route.ts", {
  pool: { connect: async () => client }, resolveCollectionUser: links.resolveCollectionUser,
  put: () => { throw new Error("Unexpected upload"); },
}, "POST");
async function submit(fields) {
  const form = new FormData();
  form.set("title", "Guest memory");
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return POST(new Request("http://localhost/api/memories", { method: "POST", body: form }));
}
assert.equal((await submit({ share: token })).status, 200);
assert.equal(owner, 42);
assert.equal((await submit({ userId: "42" })).status, 400);
assert.equal((await submit({ share: "a".repeat(64) })).status, 403);
tokens.delete(42);
assert.equal(await links.resolveShareToken(token), null);
assert.equal((await submit({ share: token })).status, 403);
console.log("PASS: random, reusable, distinct tokens; owner resolution; anonymous contributions; invalid, legacy and revoked links rejected.");

const { POST: getShareLink } = await load("../app/api/share-links/route.ts", {
  pool: { query: async (_sql, [id]) => ({ rows: id === 44 || id === 2 ? [{ id }] : [] }) }, getOrCreateShareToken: links.getOrCreateShareToken,
}, "POST");
const shareRequest = () => new Request("https://memorybook.example/api/share-links", {
  method: "POST", headers: { origin: "https://memorybook.example", "Content-Type": "application/json" },
  body: JSON.stringify({ userId: 44 }),
});
assert.equal(tokens.has(44), false);
const first = await getShareLink(shareRequest());
assert.equal(first.status, 200);
assert.equal(first.headers.get("cache-control"), "private, no-store");
const firstLink = (await first.json()).sharePath;
assert.equal(firstLink, `/share/${tokens.get(44)}`);
const repeated = await Promise.all(Array.from({ length: 5 }, () => getShareLink(shareRequest())));
for (const response of repeated) assert.equal((await response.json()).sharePath, firstLink);
const blocked = await getShareLink(new Request("https://memorybook.example/api/share-links", {
  method: "POST", headers: { origin: "https://other.example" },
}));
assert.equal(blocked.status, 403);
const { POST: failedShareLink } = await load("../app/api/share-links/route.ts", {
  pool: { query: async () => ({ rows: [{ id: 44 }] }) }, getOrCreateShareToken: async () => { throw new Error("Database unavailable"); },
}, "POST");
assert.equal((await failedShareLink(shareRequest())).status, 500);
console.log("PASS: Copy Link endpoint creates missing links, reuses stored links, prevents cross-origin access, and reports database failures.");

const requestForUser = userId => new Request("https://memorybook.example/api/share-links", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }),
});
const userTwoLink = await getShareLink(requestForUser(2));
assert.equal(userTwoLink.status, 200);
assert.equal((await userTwoLink.json()).sharePath, `/share/${tokens.get(2)}`);
assert.notEqual(tokens.get(2), tokens.get(44));
assert.equal((await getShareLink(requestForUser(999))).status, 404);
for (const id of [0, -1, 1.5, "2", null]) assert.equal((await getShareLink(requestForUser(id))).status, 400);
console.log("PASS: dashboard 2 receives its own token; invalid and nonexistent users are rejected.");
