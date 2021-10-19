module.exports = {
  "type": "postgres",
  // "url": process.env.DATABASE_URL,
  "user": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "ssl": true,
  "logging": false,
  "dialectOptions": {
    "ssl": true
  },
  "entities": [process.env.ENTITIES_DIR],
  "migrations": [process.env.MIGRATIONS_DIR],
  "subscribers": [process.env.SUBSCRIBERS_DIR],
  "cli": {
    "entitiesDir": "src/models",
    "migrationsDir": "src/database/migrations",
    "subscribersDir": "src/database/subscribers"
  }
}
