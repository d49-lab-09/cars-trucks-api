'use strict';

const carModel = (sequelize, DataTypes) => sequelize.define('Cars', {
  make: { type: DataTypes.STRING, required: true },
  model: { type: DataTypes.STRING, required: true },
  type: { type: DataTypes.ENUM('car', 'truck'), required: true },
});

module.exports = carModel;