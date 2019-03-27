const express = require("express");
const db = require("../data/actions/db_actions.js");
const bcrypt = require("bcryptjs");

const router = express.Router();

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
      res.status(500).json(err);
    }
  } else {
    res.status(400).json({ Error: "Name and password are reqired" });
  }
});

module.exports = router;
