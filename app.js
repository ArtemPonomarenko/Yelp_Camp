//MAIN DEPENDENCIES
var express        = require("express"),
    mongoose       = require("mongoose"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    app            = express(),
    dotenv         = require('dotenv').config(),
    flash = require("connect-flash");
//MODELS
var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");  
//ROUTES
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
app.use(flash());
//CONNECT TO DB
mongoose.connect(process.env.DATABASEURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    });
//AUTH  SET-UP
app.use(require("express-session")({
    secret: "Who would have guessed? What a lovely password",
    resave: false,
    saveUninitialized: false
    }));
//PASSPORT SET-UP
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//MIDDLEWARE
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});  
// APP SET-UP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// LOCALHOST
app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("Yelp Camp server has been launched!");
});