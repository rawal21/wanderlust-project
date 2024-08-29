const Listing = require("./models/listing.js");
const Review = require("./models/reveiws.js");
// const user = require("./models/user.js");


module.exports.isLogin = (req,res,next)=>{
 
  if(!req.isAuthenticated())
  {
    req.session.redirectUrl = req.originalUrl
   req.flash("error", "you must be logged in to  create  listing ");
   return res.redirect("/login");
  }
  next();
}

module.exports.saveredirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl)
  {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isonwer =  async (req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id))
  {
    req.flash("error" , "you dont have permisson for it");
    return res.redirect(`/listing/${id}`);
  }
  next();
}

module.exports.isAuthor = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    // const { id, reviwId } = req.params;
// console.log('Review ID:', reviewId); // Log the ID to check if it's correct


    // Fix typo here
    const review = await Review.findById(reviewId);

    // Check if review is null or undefined
    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listing/${id}`);
    }

    // Ensure res.locals.currUser is set and check if the author matches
    if (!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the author of the comment");
      return res.redirect(`/listing/${id}`);
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in isAuthor middleware:', error);
    req.flash("error", "An error occurred");
    return res.redirect(`/listing/${id}`);
  }
};