'use strict';

const express = require('express');
const { users } = require('../models');
const basicAuth = require('../middleware/auth/basic');
const acl = require('../middleware/auth/acl');
const bearAuth = require('../middleware/auth/bearer');

const userRouter = express.Router();


userRouter.route('/signup')
  .post(signup);

userRouter.route('/signin')
  .post(basicAuth, login);

userRouter.route('/users')
  .get(bearAuth, acl('delete'), usersRoute)
  .get(bearAuth, acl('delete'), readOne)
  .put(bearAuth, acl('delete'), update)
  .delete(bearAuth, acl('delete'), destroy);


async function signup(req, res, next) {
  try {

    const record = await users.create(req.body);
    res.status(201).json(record);
  } catch (e) {
    next(e.message);
  }
}

function login(req, res, next) {
  try {

    res.status(200).json(req.user);
  } catch (e) {
    next(e.message);
  }
}

async function usersRoute(req, res, next) {
  try {
    const allUsers = await users.findAll();
    res.status(200).send(allUsers);
  } catch (e) {
    next(e.message);
  }
}


async function update(req, res, next) {
  const id = req.params.id;
  await users.update(req.body, id);
  const getUpdate = await users.read(id);
  res.status(200).send(getUpdate);
}

async function destroy(req, res, next) {
  await users.delete(req.params.id);
  res.status(204).send();

}

async function readOne(req, res, next) {
  const oneUser = await users.read(req.params.id);
  res.status(200).send(oneUser);
}

module.exports = userRouter;
