const assert = require('assert');

const BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:5000';

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  const body = await response.json();
  return { status: response.status, body };
}

async function requestWithBody(path, method, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  return { status: response.status, body };
}

async function requestWithMethod(path, method, token, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const body = await response.json();
  return { status: response.status, body };
}

async function run() {
  const uniqueEmail = `lawtest_${Date.now()}@example.com`;
  const registerPayload = {
    name: 'API Tester',
    email: uniqueEmail,
    password: 'testpass123'
  };

  const registerRes = await requestWithBody('/api/v1/auth/register', 'POST', registerPayload);
  assert.strictEqual(registerRes.status, 201, 'Register should return 201');
  assert.strictEqual(registerRes.body.success, true);
  assert.ok(registerRes.body.data.token, 'Register should return token');

  const duplicateRegisterRes = await requestWithBody('/api/v1/auth/register', 'POST', registerPayload);
  assert.strictEqual(duplicateRegisterRes.status, 409, 'Duplicate register should return 409');

  const loginRes = await requestWithBody('/api/v1/auth/login', 'POST', {
    email: uniqueEmail,
    password: 'testpass123'
  });
  assert.strictEqual(loginRes.status, 200, 'Login should return 200');
  assert.strictEqual(loginRes.body.success, true);
  assert.ok(loginRes.body.data.token, 'Login should return token');

  const invalidLoginRes = await requestWithBody('/api/v1/auth/login', 'POST', {
    email: uniqueEmail,
    password: 'wrongpass'
  });
  assert.strictEqual(invalidLoginRes.status, 401, 'Invalid login should return 401');

  const listRes = await request('/api/v1/laws?limit=2&page=1');
  assert.strictEqual(listRes.status, 200, 'GET /laws should return 200');
  assert.strictEqual(listRes.body.success, true);
  assert.ok(Array.isArray(listRes.body.data), 'GET /laws data should be array');

  if (listRes.body.data.length > 0) {
    const lawId = listRes.body.data[0]._id;
    const idRes = await request(`/api/v1/laws/${lawId}`);
    assert.strictEqual(idRes.status, 200, 'GET /laws/:id should return 200');
    assert.strictEqual(idRes.body.success, true);
    assert.strictEqual(idRes.body.data._id, lawId);
  }

  const invalidIdRes = await request('/api/v1/laws/not-an-object-id');
  assert.strictEqual(invalidIdRes.status, 400, 'Invalid ObjectId should return 400');

  const notFoundIdRes = await request('/api/v1/laws/64b0f2f5e13a9c6b8a5e4f11');
  assert.strictEqual(notFoundIdRes.status, 404, 'Unknown ObjectId should return 404');

  const invalidBooleanRes = await request('/api/v1/laws?bailable=yes');
  assert.strictEqual(invalidBooleanRes.status, 400, 'Invalid boolean query should return 400');

  const createPayload = {
    sectionNumber: 'T-101',
    title: 'Test Law',
    description: 'Test description',
    actName: 'IPC',
    category: 'Criminal Law'
  };

  const noTokenRes = await requestWithMethod('/api/v1/laws', 'POST', null, createPayload);
  assert.strictEqual(noTokenRes.status, 401, 'Missing token should return 401');

  const invalidTokenRes = await requestWithMethod('/api/v1/laws', 'POST', 'invalid.jwt.token', createPayload);
  assert.strictEqual(invalidTokenRes.status, 401, 'Invalid token should return 401');

  const userToken = loginRes.body.data.token;
  const forbiddenRes = await requestWithMethod('/api/v1/laws', 'POST', userToken, createPayload);
  assert.strictEqual(forbiddenRes.status, 403, 'Non-admin token should return 403');

  console.log('API tests passed.');
}

run().catch((error) => {
  console.error('API tests failed:', error.message);
  process.exit(1);
});
