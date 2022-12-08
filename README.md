# LAB - 401-D49 Lab-09

## Project: auth-api

### Author: Lewis Benson, Hunter Fehr

### Problem Domain

We would like to view cars or trucks depending on user preference. If a user prefers cars, they will gain access to a list of cars. If a user prefers trucks they will gain access to a list of trucks.

### Links and Resources

- [ci/cd]() (GitHub Actions)
- [server-prod]()

### Setup

#### `.env` requirements (where applicable)

see `.env.sample`

#### How to initialize/run your application (where applicable)

- nodemon

#### Features / Routes

- Feature one: Deploy to Prod

- GET : `/` - specific route to hit

- `/signin` : POST - login as user
- `/signup` : POST - create one user
- `/users` : GET - Read all usernames
- `/cars` : GET - Read all cars
- `/trucks` : GET - Read all trucks
- `/cars` : POST - Create one cars
- `/trucks` : POST - Create one trucks
- `/cars` : PUT - Update one cars
- `/trucks` : PUT - Update one trucks
- `/cars` : DELETE - Delete one cars
- `/trucks` : DELETE - Delete one trucks

#### Tests

- How do you run tests?
  - npm test
- Any tests of note?
  - handles root path
  - handles invalid paths
  - handles every CRUD function
- Describe any tests that you did not complete, skipped, etc

#### UML

![UML](./assets/uml.png)
Link to an image of the UML for your application and response to events
