var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Comment    = require("../models/comment"),
    Campground = require("../models/campground"),
    middleware = require("../middleware");


//NEW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", err.message);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});
//CREATE NEW COMMENT LOGIC
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    req.flash("error", err.message);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Your comment was registred.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//EDIT COMMENT FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});
//UPDATE COMMENT LOGIC
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Yor comment has been updated....");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//DESTROY COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds/" + req.params.id);
        }
        req.flash("success", "Your comment has been deleted...");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;