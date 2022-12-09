'use strict';

const express = require('express');
const { users } = require('../models');
const basicAuth = require('../middleware/auth/basic');


const userRouter = express.Router();


userRouter.route('/signup')
  .post(signup);

userRouter.route('/signin')
  .post(basicAuth, login);

userRouter.route('/users')
  .get(usersRoute);


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


module.exports = userRouter;
