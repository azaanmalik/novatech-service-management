// Integration smoke test: run against a disposable MongoDB database and local API.
// Start server with MONGO_URI, JWT_SECRET, PORT and ADMIN_EMAIL before running.
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:' + (process.env.PORT || '5000');
const id = Date.now().toString(36);
const email = 'test-' + id + '@example.test';
const adminEmail = process.env.ADMIN_EMAIL || 'admin-' + id + '@example.test';
const password = 'TestPassword123!';
async function request(path, method = 'GET', data, token) {
  const res = await fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(token ? { authorization: 'Bearer ' + token } : {}) }, body: data === undefined ? undefined : JSON.stringify(data) });
  return { status: res.status, body: await res.json() };
}
async function main() {
  for (let i = 0; i < 40; i++) {
    try { const h = await request('/api/health'); if (h.body.status === 'ok') break; } catch (_) {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.equal((await request('/api/health')).body.status, 'ok');
  assert.equal((await request('/api/register', 'POST', { name: 'Test User', email, password })).status, 201);
  assert.equal((await request('/api/register', 'POST', { name: 'Test User', email, password })).status, 400);
  const login = await request('/api/login', 'POST', { email, password });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.role, 'user');
  const token = login.body.token;
  const userId = login.body.user.id;
  assert.equal((await request('/api/admin/users', 'GET', undefined, token)).status, 403);
  assert.equal((await request('/api/my-enrollments/' + userId)).status, 401);
  assert.equal((await request('/api/enroll', 'POST', { userId, serviceName: 'Web Design' }, token)).status, 201);
  assert.equal((await request('/api/my-enrollments/' + userId, 'GET', undefined, token)).status, 200);
  assert.equal((await request('/api/contact', 'POST', { name: 'Test User', email, message: 'Please contact me about a service.' })).status, 201);
  assert.equal((await request('/api/contact', 'POST', { name: '', email, message: 'bad' })).status, 400);
  assert.equal((await request('/api/admin/contacts', 'GET', undefined, token)).status, 403);
  assert.equal((await request('/api/register', 'POST', { name: 'Test Admin', email: adminEmail, password })).status, 201);
  const adminBefore = await request('/api/login', 'POST', { email: adminEmail, password });
  assert.equal(adminBefore.body.user.role, 'user', 'Public registration must never create an admin');
  console.log('Integration smoke test passed: health, registration, login, access control, booking, contact.');
}
main().catch(err => { console.error(err); process.exitCode = 1; });
