const express = require("express");
const db = require("../data/actions/db_actions.js");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

const router = express.Router();
const sessionOptions = {
  name: "theSessionName",
  secret: "akioannbkd35418dadf",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false,
  store: new knexSessionStore({
    knex: require("../data/knex.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createTable: true,
    clearInterval: 1000 * 60 * 60
  })
};

router.use(session(sessionOptions));

async function userCheck(req, res, next) {
  const { use_name, pass_word } = req.body;
  try {
    const user = await db.single_user(use_name);
    if (user && bcrypt.compareSync(pass_word, user.pass_word)) {
      req.session.user = user;
      next();
    } else {
      res.status(401).json({ Error: "You shall not pass!!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

function restrictedArea(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(400).json({
      Error: "You are not authorized. Please Sign up or login to access"
    });
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

router.get("/logout", async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ Error: "Unable to log out" });
    } else {
      res.status(200).json({ Message: "You have successfully logged out" });
    }
  });
});

router.get("/users", restrictedArea, async (req, res) => {
  try {
    const users = await db.all_users();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
