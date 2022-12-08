'use strict';

// Primary requires
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/users');
const carsRouter = require('./routes/cars');
const trucksRouter = require('./routes/trucks');


// Error handling
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
/* INSERT ROUTES HERE */
app.use(userRouter);
app.use(carsRouter);
app.use(trucksRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
