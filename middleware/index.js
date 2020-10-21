var middlewareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");


middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You have no rights to do it!");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "You need to login!");
        res.redirect("/campgrounds");
    }
};
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", err.message);
                res.redirect("/campgrounds");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You have no rights to do it!");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("error", "You need to loggin!");
        res.redirect("/login");
    }
};
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to loggin!");
    res.redirect("/login");
};

module.exports = middlewareObj;