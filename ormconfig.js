module.exports = {
  "type": "postgres",
  "url": process.env.DATABASE_URL,
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
