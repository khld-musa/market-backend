const express = require("express");
const router = express.Router();
// const Joi = require("joi");
const User = require("../models/user");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const { Expo } = require("expo-server-sdk");

// const listingsStore = require("../store/listings");
// const messagesStore = require("../store/messages");
const sendPushNotification = require("../utilities/pushNotifications");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");

const schema = Message;

router.get("/", auth, (req, res) => {
  const getMessagesForUser = (toUserId) =>
    Message.filter((message) => message.toUserId === toUserId);
  const messages = getMessagesForUser(req.user.userId);

  const mapUser = (userId) => {
    const getUserById = (id) => User.find((user) => user.id === id);
    const user = getUserById(userId);
    return { id: user.id, name: user.name };
  };

  const resources = messages.map((message) => ({
    id: message.id,
    listingId: message.listingId,
    dateTime: message.dateTime,
    content: message.content,
    fromUser: mapUser(message.fromUserId),
    toUser: mapUser(message.toUserId),
  }));

  res.send(resources);
});

router.post("/", [auth, validateWith(schema)], async (req, res) => {
  const { listingId, message } = req.body;

  const getListing = (id) => Listing.find((listing) => listing.id === id);
  const listing = getListing(listingId);
  if (!listing) return res.status(400).send({ error: "Invalid listingId." });

  const targetUser = getUserById(parseInt(listing.userId));
  if (!targetUser) return res.status(400).send({ error: "Invalid userId." });
  const add = (message) => {
    message.id = Message.length + 1;
    message.dateTime = Date.now();
    Message.push(message);
  };
  add({
    fromUserId: req.user.userId,
    toUserId: listing.userId,
    listingId,
    content: message,
  });

  const { expoPushToken } = targetUser;

  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(expoPushToken, message);

  res.status(201).send();
});

module.exports = router;
