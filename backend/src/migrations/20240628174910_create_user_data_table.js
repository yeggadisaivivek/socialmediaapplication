/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_data', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users');
    table.string('name').notNullable();
    table.string('bio');
    table.string('profile_pic_url');
    table.timestamps(true,true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('user_data');
};
