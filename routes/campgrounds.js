var Campground = require("../models/campground"),
    express    = require("express"),
    router     = express.Router({mergeParams: true}),
    middleware = require("../middleware");

//LIST ALL CAMPGROUNDS
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            req.flash("error", err.message);
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });    
});
//NEW CAMPGROUND FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});
//CREATE NEW CAMPGROUND LOGIC
router.post("/", middleware.isLoggedIn, function(req, res){
    var newCamp = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create(newCamp,
        function(err, campground){
            if(err){
                req.flash("error", err.message);
            }else{
                req.flash("success","Thank you! Your campground was added.");    
                res.redirect("/campgrounds");            }
        });

});
//SHOW ONE CAMPGROUND
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            req.flash("error", "Campground hasn't been found.");
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/show", {campground: campground});
        }

    });    
});
//EDIT CAMPGROUND FORM
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
//UPDATE CAMPGROUND LOGIC
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated...");
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});
//DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        req.flash("success", "You successfully deleted your campground.");
        res.redirect("/campgrounds");
    });
});

module.exports = router;