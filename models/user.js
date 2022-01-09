const mongoose = require("mongoose");

const User = mongoose.model("Users", {
  id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = User;
