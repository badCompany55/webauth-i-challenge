exports.up = function(knex, Promise) {
  return knex.schema.createTable("pass", tb => {
    tb.increments();
    tb.integer("pass_use_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .notNullable()
      .unique()
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("pass");
};
