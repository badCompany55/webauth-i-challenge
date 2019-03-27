exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tb => {
    tb.increments();
    tb.string("use_name", 128)
      .notNullable()
      .unique();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
