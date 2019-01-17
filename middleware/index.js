var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var middlewareObj = {};
middlewareObj.checkHotelOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        //Does the user owns the hotel?
        Hotel.findById(req.params.id, function (err, foundHotel) {
            if (err) {
                req.flash("error", "Hotels not found!!");
                res.redirect("back");
            }
            else {
                //Does the user owns the hotel?
                if (foundHotel.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that");
                    res.redirect("back");
                }

            }
        });

    } else {
        req.flash("error", "You must to be logged in to do that!!");
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        //Does the user owns the hotel?
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            }
            else {
                //Does the user owns the hotel?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have the permission to do that!!");
                    res.redirect("back");
                }
            }
        });

    } else {
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("back");
    }

}
middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must to be logged in to do that!!");
    res.redirect("/login");
}

middlewareObj.isAdminLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must to be logged in to do that!!");
    res.redirect("/admin");
}

module.exports = middlewareObj;
