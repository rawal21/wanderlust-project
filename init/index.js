const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { initialize } = require("passport");

let URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then((res)=>{
  console.log("connection sucesfull");
})
.catch((err)=>{
  console.log(err);
})

async function main(){
  await mongoose.connect(URL);
}

const initDB = async ()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj , owner:"66b7bc15594bf0d8637a434d"}))
  await Listing.insertMany(initData.data);
 console.log("data saved");
};

initDB();