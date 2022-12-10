'use strict';

const carMiddleware = require('../src/middleware/auth/carMiddleware');

describe('CarMiddleware unit tests', () => {
  //req.user.dataValues.vehicleType;
  const res = {};
  const next = jest.fn();

  it('should throw an error if truck is passed', async () => {
    const req = { user: { dataValues: 'truck' } };
    await carMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith('Not allowed');
  });

  it('should not throw an error if both is passed', async () => {
    const req = { user: { dataValues: { vehicleType: 'both' } } };
    await carMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });






});