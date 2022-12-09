'use strict';

const express = require('express');
const { trucks } = require('../models');


const trucksRouter = express.Router();


trucksRouter.route('/trucks')
  .post(create)
  .get(read);
trucksRouter.route('/trucks/:id')
  .put(update)
  .delete(destroy)
  .get(readOne);

async function read(req, res) {
  const allTrucks = await trucks.read();
  res.status(200).send(allTrucks);
}

async function create(req, res) {
  const truck = await trucks.create(req.body);
  console.log(truck);
  res.status(201).send(truck);
}

async function update(req, res, next) {
  const id = req.params.id;
  await trucks.update(req.body, id);
  const getUpdate = await trucks.read(id);
  res.status(200).send(getUpdate);
}

async function destroy(req, res, next) {
  await trucks.delete(req.params.id);
  res.status(204).send();

}

async function readOne(req, res, next) {
  const truck = await trucks.read(req.params.id);
  res.status(204).send(truck);

}



module.exports = trucksRouter;