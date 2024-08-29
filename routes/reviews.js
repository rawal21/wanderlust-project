const express = require("express");
const router = express.Router({mergeParams:true});
const wrap = require("../utils/wrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../Schema.js");
const { ListingSchema } = require("../Schema.js");
const Review = require("../models/reveiws.js");
const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const { isLogin, isAuthor } = require("../middleweres.js");
const reviewController = require("../controller/reviews.js");

  //  server validation for reviews 

  // const validateReview = (req, res, next) => {
//   let  {error} = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     // console.log(errMsg);
//     // return next(new ExpressError(400, errMsg)); // Forward the error to error-handling middleware
//   }
//   next(); // Proceed to the next middleware/handler if no errors
// };


router.post(
  "/",
  isLogin,
  // validateReview,
  wrap(reviewController.postReview)
);

//  Delete reviews roud
router.delete(
  "/:reviewId",
  isAuthor,
  wrap(reviewController.destoryReview)
);

module.exports = router ;