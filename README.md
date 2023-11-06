# Backend Engineer Work Sample

This project was built with express, express-validator and mongoose to connect to a MongoDB database.

The project is organized as:
```
__tests__: test files
models: data models
routes: the api controllers
services: services that connect to third-parties including database
shared: misc, types, constants, etc
```

## Setup

Basic setup with `yarn install` and create a `.env` based on `.env.example`.
The api requires a valid MongoDB connection to work correctly.

## Testing

The tests use `supertest` and `mongodb-memory-server` in order to have integration tests on the endpoints. These tests cover all the endpoints possibilities in an isolated form.

## Scripts

`npm start` starts the server

`yarn dev` starts the server with HMR using nodemon

`npm test` executes the tests

## Routes

### POST /user:
Saves a new user.

### Request body:
```
id: required, unique, string
email: required, unique, string
createdAt: required, string in date format YYYY-MM-DD
```
#### Responses:

**Status 201**
```
{ id: "1", email: "email@mail.com", createdAt: "2023-12-23" }
```

**Status 400**
```
{
  errorCode: "duplicated_key",
  message: "Duplicated entry found when saving the data"
}    
```

**Status 422**
```
{
  "errors": [
    {
      "type": "field",
      "value": "wrong-email-format@a",
      "msg": "invalid email format",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### GET /users
Gets the user collection and can sort by creation date.

Query params:
- **created**: optional, *ascending* or *descending*

#### Responses

**Status 200**
- `[{ id: "1", email: "email@test.com", createdAt: "2023/12/02" }]`
