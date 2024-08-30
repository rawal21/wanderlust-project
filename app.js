if(process.env.NODE_ENV != "production")
{
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.js")
const sesson  = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");


const dburl = process.env.MONGO_ALTAS;

main()
  .then((res) => {
    console.log("connection sucesfull");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

const store = MongoStore.create({
  mongoUrl : dburl,
  crypto :{
   secret : process.env.SECRET
  },
  touchAfter : 24*3600
});

const sessionOpstion = {secret : process.env.SECRET,

store,
resave : false ,
saveUninitialized : true,
cookie : {
  expries : Date.now() + 7 *24 * 60*60*60 * 1000,
  maxAge : 7 *24 * 60*60*60 * 1000,
  httpOnly : true
},
}

store.on("error", ()=>{
  console.log("Error in mongodb session " , err);
})


app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(sesson(sessionOpstion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demo", async (req,res)=>{
//   const User1 = new User({
//     email : "dikshitRawal@gmail",
//     username : "delta"
//   });

//   const newUser = await User.register(User1,"dikshit321");
//   res.send(newUser);
// })



app.use((req,res,next)=>{
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// listing routes
app.use("/listing", listingRouter);

//  reviews post rout
app.use("/listing/:id/reviews",reviewsRouter)
app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("Lisitings/error.ejs", { message });
});

app.listen(3000, () => {
  console.log("server is listioning at port 3000");
});
