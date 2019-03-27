exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", tb => {
    tb.increments();
    tb.string("use_name", 128)
      .notNullable()
      .unique();
    tb.string("pass_word").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
