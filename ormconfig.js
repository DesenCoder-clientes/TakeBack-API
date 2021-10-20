module.exports = {
  "type": "postgres",
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "logging": true,
  "entities": [process.env.ENTITIES_DIR],
  "migrations": [process.env.MIGRATIONS_DIR],
  "subscribers": [process.env.SUBSCRIBERS_DIR],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/database/migrations",
    "subscribersDir": "src/database/subscribers"
  }
}
