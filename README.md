# Northcoders House of Games API

## Project details

This project is an API for a boardgames review website. It was made as a backend portfolio piece as part of the Northcoders Coding Bootcamp.

A hosted version is available on https://rk-board-games.herokuapp.com/api/

## Setup Instructions

    // install dependencies
    npm install

    // Set environment variables (see below)

    // seed development data
    npm run seed

    // run test suites
    npm test

    // run unit testing only
    npm test utils.test.js

    // run integration tests only
    npm test app.test.js

### Environment Variables

In order to connect to the necessary test and developer databases, you must first add the required environment variables.

To do this, create the following files:

- `.env.devlopment`

- `.env.test`

Then add the following text to each file respectively:

- `PGDATABASE=nc_games`

- `PGDATABASE=nc_games_test`

These files should be automatically added to `.gitignore`

If you are unsure, there is a file called `.env-example` which gives an example of how your files should look.

## Minimum Requirements

Node.js : v18.4.0

Postgres : v14
