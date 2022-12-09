'use strict';
const { app } = require('../src/server');
const supertest = require('supertest');
const request = supertest(app);
const { db } = require('../src/models');
const { users } = require('../src/models');


beforeAll(async () => {
  await db.sync();
  await users.create({
    username: 'tester1',
    password: 'password',
    role: 'admin',
  });
  await users.create({
    username: 'tester2',
    password: 'password',
    role: 'user',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('Test of API', () => {
  test('should see proof of life when connecting', () => {
    console.log('tests');
  });
});