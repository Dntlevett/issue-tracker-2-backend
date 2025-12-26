/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// exports.up = function (knex) {
//   return knex.schema.createTable("tickets", (table) => {
//     table.increments("id").primary();
//     table.string("name").notNullable();
//     table.string("email").notNullable();
//     table.text("message").notNullable();
//     table.string("status").defaultTo("Open");
//     table.json("tags").defaultTo("[]");
//     table.timestamp("created_at").defaultTo(knex.fn.now());
//   });
// };

exports.up = function (knex) {
  return knex.schema.createTable("tickets", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable();
    table.text("message").notNullable();
    table.string("status").defaultTo("Open");
    table.text("tags").notNullable().defaultTo("[]"); // FIXED
    table.timestamp("created_at").defaultTo(knex.fn.now()); // FIXED
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("tickets");
};
