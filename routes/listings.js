const express = require("express");
const router = express.Router();
const wrap = require("../utils/wrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../Schema.js");
const { ListingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const { isLogin, isonwer } = require("../middleweres.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//   server validation for listing
const validationListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    // throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
// all listings

router.get("/new", isLogin, listingController.new);
router.get("/:id/edit", isLogin, isonwer, wrap(listingController.edit));
router
  .route("/")
  .get(wrap(listingController.index))
  .post(isLogin, upload.single('listing[image]'), validationListing ,wrap(listingController.post));

router
  .route("/:id")
  .get(wrap(listingController.show))
  .put(isLogin, isonwer,upload.single('listing[image]') ,validationListing, wrap(listingController.update))
  .delete(isLogin, isonwer, wrap(listingController.delete));

module.exports = router;
