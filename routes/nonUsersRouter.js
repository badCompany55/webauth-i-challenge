const express = require("express");
const db = require("../data/actions/db_actions.js");
const bcrypt = require("bcryptjs");

const router = express.Router();

async function userCheck(req, res, next) {
  const { use_name, pass_word } = req.body;
  try {
    const user = await db.single_user(use_name);
    if (user && bcrypt.compareSync(pass_word, user.pass_word)) {
      next();
    } else {
      res.status(401).json({ Error: "You shall not pass!!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

router.post("/registar", async (req, res) => {
  let credentials = req.body;
  if (credentials.use_name && credentials.pass_word) {
    try {
      const hash = await new Promise((res, rej) => {
        bcrypt.hash(credentials.pass_word, 10, function(err, hash) {
          if (err) rej(err);
          res(hash);
        });
      });
      credentials.pass_word = hash;
      // console.log(credentials);
      const user = await db.add_user(credentials);
      res.status(201).json(user);
    } catch (err) {
      if ((err.errno = 19)) {
        res.status(400).json({
          Error: "The username has already been taken. Please try another"
        });
      } else {
        res.status(500).json(err);
      }
    }
  } else {
    res.status(400).json({ Error: "Name and password are reqired" });
  }
});

router.post("/login", userCheck, async (req, res) => {
  res.status(200).json({ Message: "Logged In" });
});

router.get("/users", userCheck, async (req, res) => {
  try {
    const users = await db.all_users();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
