'use strict';

const truckModel = (sequelize, DataTypes) => sequelize.define('Trucks', {
  make: { type: DataTypes.STRING, required: true },
  model: { type: DataTypes.STRING, required: true },
  type: { type: DataTypes.ENUM('car', 'truck'), required: true },
});

module.exports = truckModel;