# Northcoders House of Games API

## Setup Instructions

In order to connect to the necessary test and developer databases, you must first add the required environment variables.

To do this, create the following files:

- `.env.devlopment`

- `.env.test`

Then add the following text to each file respectively:

- `PGDATABASE=nc_games`

- `PGDATABASE=nc_games_test`

These files should be automatically added to `.gitignore`

If you are unsure, there is a file called `.env-example` which gives an example of how your files should look.
