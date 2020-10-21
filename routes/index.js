var express  = require("express"),
    router   = express.Router({mergeParams: true}),
    User     = require("../models/user"),
    passport = require("passport");



//LANDING PAGE ROUTE
router.get("/", function(req, res){
    res.render("landing");
    });
//REGISTER FORM
router.get("/register", function(req, res){
    res.render("register");
});
//REGISTER LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelp Camp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});
//LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});
//LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});
//LOGOUT
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out...");
    res.redirect("/");
});

module.exports = router;