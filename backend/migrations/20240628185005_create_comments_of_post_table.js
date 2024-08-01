/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('comments_of_post', (table) => {
        table.increments('id').primary();
        table.integer('post_id').unsigned().references('id').inTable('posts');
        table.json('comments');
        table.timestamps(true,true);
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments_of_post');
};
