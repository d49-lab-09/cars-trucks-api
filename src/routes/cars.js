'use strict';

const express = require('express');
const { cars } = require('../models');
const bearAuth = require('../middleware/auth/bearer');
const carChecker = require('../middleware/auth/carMiddleware');
const carsRouter = express.Router();
const acl = require('../middleware/auth/acl');

carsRouter.route('/cars')
  .post(bearAuth, carChecker, acl('create'), create)
  .get(bearAuth, carChecker, acl('read'), read);
carsRouter.route('/cars/:id')
  .put(bearAuth, carChecker, acl('update'), update)
  .delete(bearAuth, carChecker, acl('delete'), destroy)
  .get(bearAuth, carChecker, acl('read'), readOne);

async function read(req, res, next) {

  const allCars = await cars.read();
  res.status(200).send(allCars);
}

async function create(req, res) {
  const car = await cars.create(req.body);
  console.log(car);
  res.status(201).send(car);
}

async function update(req, res, next) {
  const id = req.params.id;
  await cars.update(req.body, id);
  const getUpdate = await cars.read(id);
  res.status(200).send(getUpdate);
}

async function destroy(req, res, next) {
  await cars.delete(req.params.id);
  res.status(204).send();

}

async function readOne(req, res, next) {
  const car = await cars.read(req.params.id);
  res.status(200).send(car);

}



module.exports = carsRouter;