const mongoose = require("mongoose");
const Joi = require("joi");

const Message = mongoose.model("Messages", {
  listingId: { type: Number, required: true },
  message: { type: String, required: true },
});
module.exports = Message;
