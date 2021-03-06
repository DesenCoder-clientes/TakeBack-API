# API TAKE BACK

Steps to run this project:

## Configure the environment variables

    DB_HOST=host-of-your-database-server
    DB_PORT=port-of-your-database-server
    DB_NAME=name-of-your-database
    DB_USER=database-user-name
    DB_PASS=database-user-password

    ENTITIES_DIR=directory-of-the-entities
    MIGRATIONS_DIR=directory-of-the-migrations
    SUBSCRIBERS_DIR=directory-of-the-subscribers

    MAIL_CONFIG_HOST=your-email-host
    MAIL_CONFIG_PORT=email-connection-port
    MAIL_CONFIG_SECURE=if-secure-or-not
    MAIL_CONFIG_USER=your-email-user
    MAIL_CONFIG_PASS=your-email-password

    JWT_PRIVATE_KEY=private-key-for-token-generation
    JWT_EXPIRES_IN=token-expiration-time

## Install depencies

_Run:_

    yarn
    or
    npm install

## Execute the migrations in your database connection to development environment

    npm run typeorm migration:run

## Generate seed data

_Access the route in api:_

    /support/generate-initial-data
