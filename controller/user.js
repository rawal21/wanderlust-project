const User = require("../models/user");

module.exports.signup = (req,res)=>{
  res.render("user/signup.ejs");
}

module.exports.signupPost = async(req,res)=>{

  try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registoredUser = await User.register(newUser,password);
    console.log(registoredUser);
    req.login(registoredUser,(err,next)=>{
      if(err)
      {
        return next(err);
      }
      req.flash("sucess", "welcome to wenderlust");
     res.redirect("/listing");
    })
  
  } catch(e)
  {
  req.flash("error", e.message);
  res.redirect("/signup");
  }

    
}

module.exports.login = (req,res)=>{
  res.render("user/login.ejs");
}
module.exports.loginPost = (req,res)=>{
  req.flash("sucess", "welcome to wenderlust");
  let redirectUrl = res.locals.redirectUrl || "/listing"
  res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
  req.logOut((err,next)=>{ 
    if(err)
    {
      return next(err);
    }
   req.flash("sucess" , "you are succesfull logout ");
   res.redirect("/listing");
  })
}