
const mongoose = require("mongoose");
const { ListingSchema } = require("../Schema");
const Schema = mongoose.Schema;
const Review = require("./reveiws")


const listing = new Schema({
  title : {
     type : String,
     required : true ,
    
  },

  description : String,
  
  image : {
   url : String,
   fileName : String
  },

  price : {
    type : Number,
   
  },
  location :
  {
  type : String,
  required : true
  },

  country :
  {
   type : String,
   required : true
  },

  reviews :  [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref  : "User"
  },

   goemetry : {
    type: {
        type: String,
        enum: ['Point'], // 'Point' is the type for GeoJSON points
        required: true
    },
    coordinates: {
        type: [Number], // Array of numbers [longitude, latitude]
        required: true
    }
},
});

listing.post("findOneAndDelete",async (listing)=>{
  if(listing)
  {
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})

const Listing = mongoose.model("Listing",listing);
module.exports = Listing;