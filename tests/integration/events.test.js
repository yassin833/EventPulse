const request = require('supertest');
const app = require('../../app.js');
const User = require('../../models/user.model.js');
const {connectTestDB, disconnectTestDB} = require('../setup.js');

let adminToken;

beforeAll(async () => {
  await connectTestDB();
  await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  });
  const res = await request(app)
  .post('/api/auth/login')
  .send({email: 'admin@test.com', password: 'password123'});
  adminToken = res.body.data.token;
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('Events Endpoint', () => {
  it('GET /api/events returns 200 and an array of events', async () => {
    const res = await request(app).get('/api/events').expect(200);
    expect(Array.isArray(res.body.data.events)).toBe(true);
  });

  it('POST /api/events returns 401 if no JWT token was provided', async () => {
    await request(app).post('/api/events').send({title: 'X'}).expect(401);
  });

  it('POST /api/events returns 422 if there are missing fields', async () => {
    await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({title: ''})
      .expect(422);
  });
});