module.exports = {
  "type": process.env.DB_TYPE,
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "logging": false,
  "entities": ["src/models/**/*.ts"],
  "migrations": ["src/database/migrations/**/*.ts"],
  "subscribers": ["src/database/subscribers/**/*.ts"],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/database/migrations",
    "subscribersDir": "src/database/subscribers"
  }
}
