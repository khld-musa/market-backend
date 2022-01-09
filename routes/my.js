const express = require("express");
const router = express.Router();
const Item = require("../models/Listing");

// const listingsStore = require("../store/listings");
const auth = require("../middleware/auth");
const listingMapper = require("../mappers/listings");

router.get("/listings", auth, (req, res) => {
  const filterListings = (predicate) => Item.filter(predicate);
  const listings = filterListings(
    (listing) => listing.userId === req.user.userId
  );
  const resources = listings.map(listingMapper);
  res.send(resources);
});

module.exports = router;
