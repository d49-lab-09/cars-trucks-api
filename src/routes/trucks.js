'use strict';

const express = require('express');


const trucksRouter = express.Router();


trucksRouter.route('/trucks')
  .post(create)
  .get(read)
  .put(update)
  .delete(destroy);

function read(req, res, next) {
  res.status(200).send('proof of life read');
}

function create(req, res, next) {
  res.status(201).send('proof of life create');
}

function update(req, res, next) {
  res.status(200).send('proof of life update');
}

function destroy(req, res, next) {
  res.status(204).send('proof of life destroy');
}



module.exports = trucksRouter;