const User= require("../models/user.js");

module.exports.renderSignupForm = async(req,res,next)=>{
    res.render("./users/signup.ejs");
};

module.exports.signupUser = async(req,res,next)=>{
    try{
        let {username, email, password} = req.body;
        const newUser= new User({ 
            username: username,
            email:email,
        })
        const registeredUser= await User.register(newUser,password);

        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm= (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.loginUser = async(req,res)=>{
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are now logged out!");
        res.redirect("/listings");
    });
};
