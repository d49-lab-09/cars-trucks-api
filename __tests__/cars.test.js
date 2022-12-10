'use strict';

const supertest = require('supertest');
const { app } = require('../src/server');
const request = supertest(app);
const {db, users} = require('../src/models');


beforeAll(async () => {
  await db.sync();
  
  await users.create({
    username: 'tester3',
    password: 'pass',
    role: 'admin',
    vehicleType: 'both',
  });


  await users.create({
    username: 'tester4',
    password: 'pass',
    role: 'user',
    vehicleType: 'car',
  });

});

afterAll(async () =>{
  await db.drop();

});

async function logIn(){
  const data = await request.post('/signin').auth('tester3', 'pass');
  console.log(data);
  return data.body.token;
  
}

async function createCar(make, model){
  const token = logIn();
  const data = await request.post('/cars').send({
    make: make,
    model: model,
    type: 'car',
  }).set('Authorization', 'bearer '+ token);
  return data.body;
  
}

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
    console.log(token, 'PICKEL');
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
  
});