# Northcoders House of Games API

## Project details

This project is an API for a boardgames review website. It was made as a backend portfolio piece as part of the Northcoders Coding Bootcamp.

A hosted version is available on https://rk-board-games.herokuapp.com/api/

## Setup Instructions

This repository is available to fork and clone from https://github.com/RossKeen/Boardgame-Backend-Project

Ensure that all dependencies are installed locally by running `npm install` on the command line from within the repository.

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

### Seeding

To run the seeding script, enter `npm run seed` on the command line. This will seed your local database with the development data.

The test database will be automatically seeded whenever tests are run.

### Testing

To run tests, enter `npm test` on the command line. This will seed the test data and run the test suite every time it is run.

If you wish only to view the tests related to the `app.js`, enter `npm test app.js` instead.

## Minimum Requirements

Node.js : v18.4.0

Postgres : v14
