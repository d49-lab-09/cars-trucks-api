'use strict';

const userModel = require('./users.js');
const { Sequelize, DataTypes } = require('sequelize');
const carModel = require('./cars');
const truckModel = require('./trucks');
const Collection = require('./interface');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL);

const cars = carModel(sequelize, DataTypes);
const trucks = truckModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
  cars: new Collection(cars),
  trucks: new Collection(trucks),
};
