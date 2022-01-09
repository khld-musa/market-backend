const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validateWith = require("../middleware/validation");

const schema = User;

router.post("/", validateWith(schema), (req, res) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    User.findOne({ email: req.body.email })
      .then((user1) => {
        if (user1) {
          return res.status(401).json({
            message: "User Already Exist",
          });
        }

        user.save().then((result) => {
          if (!result) {
            return res.status(500).json({
              message: "Error Creating USer",
            });
          }
          res.status(201).json({
            message: "User created!",
            result: result,
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.get("/", validateWith(schema), (req, res) => {
  const getUsers = () => User;
  res.send(getUsers());
});

module.exports = router;
