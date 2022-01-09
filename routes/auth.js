const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validateWith = require("../middleware/validation");

const schema = User;

router.post("/", validateWith(schema), (req, res) => {
  let fetchedUser;

  User.findOne({email:req.body.email}).then(user=>{
      if (!user) {
        return res.status(401).json({
          message: "Auth failed no such user",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      console.log(fetchedUser);
      if (!result) {
        return res.status(401).json({
          message: "Auth failed inccorect password",
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "jwtPrivateKey"
      );
      res.send(token);
    })
    .catch((e) => {
      console.log(e);
    });
});

module.exports = router;
