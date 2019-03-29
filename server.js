const express = require("express");
const helm = require("helmet");
const morg = require("morgan");
const usersRouter = require("./routes/usersRouter.js");
const nonUsersRouter = require("./routes/nonUsersRouter.js");

const server = express();

server.use(helm(), express.json(), morg("dev"));
server.use("/api", nonUsersRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.send(`<h1>Zachs Autho build</h1>`);
});

module.exports = server;
