/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table('posts', function (table) {
        table.string('media_type').defaultTo('image');
    });
};

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = function (knex) {
    return knex.schema.table('posts', function (table) {
        table.dropColumn('media_type');
    });
};
