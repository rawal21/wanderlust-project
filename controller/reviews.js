 const Review =  require("../models/reveiws");
 const Listing = require("../models/listing");
 const mongoose = require("mongoose");
module.exports.postReview = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  
  // if (!listing) {
  //   return next(new ExpressError(404, "Listing not found"));
  // }
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  // res.send("Updated record");
  req.flash("sucess", "new review added")
  res.redirect(`/listing/${listing._id}`);
}

module.exports.destoryReview = async (req, res) => {
  let { id, reviewId } = req.params;

  id = id.trim();
  reviewId = reviewId.trim();

  console.log(`Received id:${id}`);
  console.log(`Received reviewId:${reviewId}`);
  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(reviewId)
  ) {
    return res.status(400).send("Invalid ID format");
  }

  try {
    // Pull reviewId from the listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review document
    await Review.findByIdAndDelete(reviewId);

    // Redirect to the updated listing
    req.flash("sucess", " review deleted")
    res.redirect(`/listing/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}