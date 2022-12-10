'use strict';

const truckMiddleware = require('../src/middleware/auth/truckMiddleware');

describe('truck middleware unit tests', () => {
  const res = {};
  const next = jest.fn();
  it('Should call "next" with no argument', () => {
    //req.user.dataValues.vehicleType;
    const req = {user: {dataValues: {vehicleType: 'truck'}}};
    truckMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();

    

  });

  it('Should call "next" with arguments', () => {
    //req.user.dataValues.vehicleType;
    const req = {user: {dataValues: {vehicleType: 'car'}}};
    truckMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith('Not allowed');

    

  });
  
});