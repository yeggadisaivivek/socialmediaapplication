// Update with your config settings.
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: 3306,
      typeCast: function (field, next) {
        if (field.type == 'VAR_STRING') {
          return field.string();
        }
        return next();
      }
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
};
