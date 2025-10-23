if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express =require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError= require("./util/ExpressError.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User=require("./models/user.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const dbURL= process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}


const app=express();
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs",ejsMate);


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error", (err)=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly:true,
    },
};


//express sessions
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");  
    res.locals.currUser = req.user; 
    next();
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

// This will catch all unmatched routes including "/"
app.all('/{*splat}', async (req, res, next) => {
    next(new ExpressError(404,"Page not found!"));
});

//server error handling
app.use((err,req,res,next)=>{
    let{statusCode=500, message}=err;
    res.status(statusCode).render("error.ejs",{err});
});

const port = process.env.PORT || 8080;

app.listen(port,()=>{
    console.log("server is listening on port 8080...");
});
