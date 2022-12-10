'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const request = supertest(app);
const {db, users} = require('../src/models');

beforeAll(async () => {
  await db.sync();
  
  await users.create({
    username: 'tester',
    password: 'pass',
    role: 'admin',
    vehicleType: 'both',
  });


  await users.create({
    username: 'tester2',
    password: 'pass',
    role: 'user',
    vehicleType: 'car',
  });

});

afterAll(async () =>{
  await db.drop();

});

async function logIn(){
  const data = await request.post('/signin').auth('tester', 'pass');
  return data.body.token;
  
}

describe('User routes and db', () => {
  test('Finds all users', async () => {
    const logInData = await logIn();
    const allUsers = await request.get('/users').set('Authorization', 'bearer ' + logInData);
    expect(allUsers.body).toHaveLength(2);
    expect(allUsers.status).toBe(200);
    expect(allUsers.body[0].username).toEqual('tester');
  });


  test('Users Ability To Sign In', async () => {
    const data = await request.post('/signin').auth('tester', 'pass');
    expect(data.status).toBe(200);
    expect(data.body.username).toEqual('tester');
    expect(typeof data.body.token === 'string').toBeTruthy();
  });

  test('Users Ability To Sign Up', async () => {
    const data = await request.post('/signup').send({
      username: 'tester3',
      password: 'pass',
      role: 'user',
      vehicleType: 'car',
    });
    expect(data.status).toBe(201);
    expect(data.body.username).toEqual('tester3');
    expect(typeof data.body.token === 'string').toBeTruthy();
  });
  
});
