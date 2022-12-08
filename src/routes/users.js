'use strict';

const express = require('express');


const userRouter = express.Router();


userRouter.route('/signup')
  .post(signup);

userRouter.route('/signin')
  .post(login);

userRouter.route('/users')
  .get(users);


function signup(req, res, next) {
  res.status(200).send('proof of life');
}

function login(req, res, next) {
  res.status(200).send('proof of life');
}

function users(req, res, next) {
  res.status(200).send('proof of life');
}


module.exports = userRouter;
