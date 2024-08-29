const express = require("express");
const wrap = require("../utils/wrap");
const User = require("../models/user");
const passport = require("passport");
const { saveredirectUrl } = require("../middleweres");
const router = express.Router({ mergeParams: true });
const UserController = require("../controller/user.js");

router
  .route("/signup")
  .get(UserController.signup)
  .post(wrap(UserController.signupPost));

router
  .route("/login")
  .get(UserController.login)
  .post(
    saveredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.loginPost
  );

router.get("/logout", UserController.logout);
module.exports = router;
