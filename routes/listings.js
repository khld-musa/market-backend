const express = require("express");
const router = express.Router();
// const Joi = require("joi");
const multer = require("multer");
// const Listing = require("../models/Listing");
const Item = require("../models/Listing")
// const store = require("../store/listings");
const categoriesStore = require("../store/categories");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const imageResize = require("../middleware/imageResize");
const delay = require("../middleware/delay");
const listingMapper = require("../mappers/listings");
const config = require("config");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const schema = Item;

const validateCategoryId = (req, res, next) => {
  if (!categoriesStore.getCategory(parseInt(req.body.categoryId)))
    return res.status(400).send({ error: "Invalid categoryId." });

  next();
};

router.post(
  "/",
  [
    // Order of these middleware matters.
    // "upload" should come before other "validate" because we have to handle
    // multi-part form data. Once the upload middleware from multer applied,
    // request.body will be populated and we can validate it. This means
    // if the request is invalid, we'll end up with one or more image files
    // stored in the uploads folder. We'll need to clean up this folder
    // using a separate process.
    // auth,
    upload.array("images", config.get("maxImageCount")),
    validateWith(schema),
    validateCategoryId,
    imageResize,
  ],

  async (req, res) => {
    const item = new Item({
      title: req.body.title,
      price: parseFloat(req.body.price),
      categoryId: parseInt(req.body.categoryId),
      description: req.body.description,
    });
    // const addListing = (listing) => {
    //   listing.id = Listing.length + 1;
    //   Listing.push(listing);
    // };

    item.save().then((result) => {
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

    item.images = req.images.map((fileName) => ({ fileName: fileName }));
    if (req.body.location) item.location = JSON.parse(req.body.location);
    if (req.user) item.userId = req.user.userId;

    // addListing(item);

    res.status(201).send(item);
  }
);

router.get("/", (req, res) => {
  // const getItem = () => Item;
  // const listings = getItem();
  // const resources = Item.map(listingMapper);
  // res.send(resources);

  // const getItme = () => Item;
  // getItme(Item);

  // console.log(Item);

  Item.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });

});

module.exports = router;
