const Listing = require("../models/listing");
const axios = require('axios');
const mapToken = process.env.MAP_TOKENS;



module.exports.index = async (req, res) => {
  const AllListing = await Listing.find({});
  res.render("Lisitings/index.ejs", { AllListing });
};

module.exports.new = (req, res) => {
  res.render("Lisitings/new.ejs");
}

module.exports.post = async (req, res, next) => {

  const apiKey = mapToken;
  const encodedAddress = encodeURIComponent(req.body.listing.location);
  const geocodeUrl = `https://api.tomtom.com/search/2/geocode/${encodedAddress}.json?key=${apiKey}`;

  // Fetch geocoding data
  const response = await axios.get(geocodeUrl);
  const result = response.data.results[0];
  const lat = result.position.lat;
  const lon = result.position.lon;
console.log(lon,lat);
  // Store coordinates in GeoJSON format



  let url = req.file.path;
  let fileName = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner =  req.user._id;
  newListing.image = {url,fileName};
  newListing.goemetry = {
    type: 'Point',
    coordinates: [lon,lat]
};
    let savedListing = await newListing.save();
    console.log(savedListing);
  req.flash("sucess", "new listing added")
  res.redirect("/listing");
}

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path : "reviews", 
  populate: {
   path : "author"
  },
}).populate("owner");

  if(!listing)
  {
    req.flash("error" , "requested listing is does'nt exist");
    res.redirect("/listing");
  }
  res.render("Lisitings/show.ejs", { listing });
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing)
  {
    req.flash("error" , "requested listing is does'nt exist");
    res.redirect("/listing");
  }
  let originalUrl = listing.image.url;
  console.log(originalUrl);
  originalUrl =originalUrl.replace("/upload","/upload/h_250,w_300");
  res.render("Lisitings/edit.ejs", { listing , originalUrl });
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined")
    {
      let url = req.file.path;
      let file = req.file.filename;
      listing.image = {url,file};
        await  listing.save();
    }
  req.flash("sucess", "new listing  updated")
  res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("sucess", "listing deleted")
  res.redirect("/listing");
}