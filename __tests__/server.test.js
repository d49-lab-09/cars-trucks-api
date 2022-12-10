'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const request = supertest(app);
const { db, users } = require('../src/models');

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

afterAll(async () => {
  await db.drop();

});

async function logIn() {
  const data = await request.post('/signin').auth('tester', 'pass');
  return data.body.token;

}



async function createCar(make, model) {
  const token = await logIn();
  const data = await request.post('/cars').send({
    make: make,
    model: model,
    type: 'car',
  }).set('Authorization', 'bearer ' + token);
  return data.body;
}


async function createTruck(make, model) {
  const token = await logIn();
  const data = await request.post('/trucks').send({
    make: make,
    model: model,
    type: 'truck',
  }).set('Authorization', 'bearer ' + token);
  return data.body;
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

describe('Cars routes and db', () => {
  test('Creates and Finds all cars', async () => {
    const token = await logIn();
    await createCar('bmw', 'm3');
    await createCar('bmw', 'm4');
    await createCar('bmw', 'x5');
    const allCars = await request.get('/cars').set('Authorization', 'bearer ' + token);
    expect(allCars.body).toHaveLength(3);
    expect(allCars.status).toBe(200);
    expect(allCars.body[0].make).toEqual('bmw');
    expect(allCars.body[0].model).toEqual('m3');

  });


  test('Users Ability To See One Car', async () => {
    const token = await logIn();
    const data = await request.get('/cars/1').set('Authorization', 'bearer ' + token);

    expect(data.status).toBe(200);
    expect(data.body.make).toEqual('bmw');
    expect(data.body.model).toEqual('m3');

  });

  test('Users Ability Update a Car', async () => {
    const token = await logIn();
    const data = await request.put('/cars/2').send({
      make: 'bmw',
      model: 'm440i',
      type: 'car',
    }).set('Authorization', 'bearer ' + token);
    expect(data.status).toBe(200);
    expect(data.body.make).toEqual('bmw');
    expect(data.body.model).toEqual('m440i');
  });

  test('Users Ability Delete a Car', async () => {
    const token = await logIn();
    const data = await request.delete('/cars/2').set('Authorization', 'bearer ' + token);
    expect(data.status).toBe(204);

  });

});

describe('Trucks routes and db', () => {
  test('Creates and Finds all Trucks', async () => {
    const token = await logIn();
    await createTruck('bmw', 'm3');
    await createTruck('bmw', 'm4');
    await createTruck('bmw', 'x5');
    const allTrucks = await request.get('/trucks').set('Authorization', 'bearer ' + token);
    expect(allTrucks.body).toHaveLength(3);
    expect(allTrucks.status).toBe(200);
    expect(allTrucks.body[0].make).toEqual('bmw');
    expect(allTrucks.body[0].model).toEqual('m3');

  });


  test('Users Ability To See One Truck', async () => {
    const token = await logIn();
    const data = await request.get('/trucks/1').set('Authorization', 'bearer ' + token);

    expect(data.status).toBe(200);
    expect(data.body.make).toEqual('bmw');
    expect(data.body.model).toEqual('m3');

  });

  test('Users Ability Update a Truck', async () => {
    const token = await logIn();
    const data = await request.put('/trucks/2').send({
      make: 'bmw',
      model: 'm440i',
      type: 'car',
    }).set('Authorization', 'bearer ' + token);
    expect(data.status).toBe(200);
    expect(data.body.make).toEqual('bmw');
    expect(data.body.model).toEqual('m440i');
  });

  test('Users Ability Delete a Truck', async () => {
    const token = await logIn();
    const data = await request.delete('/trucks/2').set('Authorization', 'bearer ' + token);
    expect(data.status).toBe(204);

  });

});
