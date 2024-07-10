/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('likes_of_post', (table) => {
        table.increments('id').primary();
        table.integer('post_id').unsigned().references('id').inTable('posts');
        table.json('liked_by_users');
        table.timestamps(true,true);
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('likes_of_post');
};
