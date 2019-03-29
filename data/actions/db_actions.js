const db = require("../knex.js");

module.exports = {
  add_user,
  all_users,
  single_user
};

function add_user(user) {
  return db("users").insert(user);
}

function all_users() {
  return db("users");
}

function single_user(username) {
  return db("users")
    .where("use_name", username)
    .first();
}
