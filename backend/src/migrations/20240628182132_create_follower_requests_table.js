/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('follower_requests', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('request_id_from');
        table.enu('status_of_request',['pending', 'accept', 'decline']).defaultTo('pending').notNullable();
        table.timestamps(true,true);
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('follower_requests');
};
