 const joi = require("joi")
const ListingSchema = joi.object({
  listing : joi.object({
   title : joi.string().required(),
   description: joi.string().required(),
   location : joi.string().required(),
   country : joi.string().required(),
   price : joi.number().required().min(0),
   image : joi.string().allow("",null),
  }).required()
});






const reviewSchema = joi.object({
  // Define your schema fields and validations here
  comment: joi.string().required(),
  rating: joi.number().required().min(1).max(5),
});

module.exports = { reviewSchema };
module.exports = {ListingSchema};
