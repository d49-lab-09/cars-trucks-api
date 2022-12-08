'use strict';

const truckModel = (sequelize, DataTypes) => sequelize.define('Cars', {
  make: { type: DataTypes.STRING, required: true },
  model: { type: DataTypes.INTEGER, required: true },
  type: { type: DataTypes.ENUM('car', 'truck'), required: true },
});

module.exports = truckModel;