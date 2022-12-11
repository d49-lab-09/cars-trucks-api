# LAB - 401-D49 Lab-09

## Project: auth-api

### Author: Lewis Benson, Hunter Fehr

### Problem Domain

We would like to view cars or trucks depending on user preference. If a user prefers cars, they will gain access to a list of cars. If a user prefers trucks they will gain access to a list of trucks.

### Links and Resources

- [ci/cd](https://github.com/d49-lab-09/cars-trucks-api/actions) (GitHub Actions)
- [server-prod](https://d49-cars-trucks.onrender.com/)

### Setup

`npm i` to install dependencies
`nodemon` to start server on port 3001
`node userInterface.js` to run a command line interface for full CRUD interaction.

#### `.env` requirements

see `.env.sample`

#### How to initialize/run your application (where applicable)

- nodemon
  `node userInterface.js` to run a command line interface for full CRUD interaction.

#### Features / Routes

- Feature one: Deploy to Prod

- GET : `/` - goes to a 404

- `/signin` : POST - login as user
- `/signup` : POST - create one user
- `/users` : GET - Read all usernames
- `/users/:id` : PUT - Update user
- `/users/:id` : DELETE - Delete user
- `/cars` : GET - Read all cars
- `/cars/:id` : GET - Read one car
- `/trucks` : GET - Read all trucks
- `/trucks:/id` : GET - Read one truck
- `/cars` : POST - Create one car
- `/trucks` : POST - Create one truck
- `/cars/:id` : PUT - Update one car
- `/trucks/:id` : PUT - Update one truck
- `/cars/:id` : DELETE - Delete one car
- `/trucks/:id` : DELETE - Delete one truck

#### Tests

- How do you run tests?
  - npm test
- Any tests of note?

  - handles every CRUD function
  - handles middleware
  - handles database calls

#### UML

![UML](./assets/uml.png)
Link to an image of the UML for your application and response to events
