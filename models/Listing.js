const mongoose = require("mongoose");
const Joi = require("joi");

const Item = mongoose.model("Listings", {
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  categoryId: { type: Number, required: true },
  // location: {
  //   type: Object,
  // },
});
module.exports = Item;
