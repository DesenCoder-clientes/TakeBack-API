# API TAKE BACK

Steps to run this project:

## Configure the environment variables

    DB_TYPE=
    DB_HOST=
    DB_PORT=
    DB_USER=
    DB_PASS=
    DB_NAME=

    MAIL_CONFIG_HOST=
    MAIL_CONFIG_PORT=
    MAIL_CONFIG_SECURE=
    MAIL_CONFIG_USER=
    MAIL_CONFIG_PASS=

    JWT_PRIVATE_KEY=
    JWT_EXPIRES_IN=

## Install depencies
_Run:_

    yarn
    or
    npm install

## Execute the migrations in your database connection

    npm run typeorm migration:run

## Generate seed data
_Access the route in api:_

    /support/generate-initial-data