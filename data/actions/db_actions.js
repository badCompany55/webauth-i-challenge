const db = require("../knex.js");

module.exports = {
  add_user
};

function add_user(user) {
  console.log(user);
  return db("users").insert(user);
}
