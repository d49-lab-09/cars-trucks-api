'use strict';

module.exports = async function (req, res, next) {
  const typeProtection = req.user.dataValues.vehicleType;
  if (typeProtection === 'both' || typeProtection === 'truck') {
    next();
  } else {
    next('Not allowed');
  }

};