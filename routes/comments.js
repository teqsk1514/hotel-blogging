var express = require("express");
var router = express.Router({ mergeParams: true });
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var midddleware = require("../middleware");
//Comments New
router.get("/new", midddleware.isLoggedIn, function (req, res) {
    console.log(req.params.id);
    Hotel.findById(req.params.id, function (err, hotel) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { hotel: hotel });
        }
    });
});

//Comments Create
router.post("/", midddleware.isLoggedIn, function (req, res) {
    Hotel.findById(req.params.id, function (err, hotel) {
        if (err) {
            console.log(err);
            res.redirect("/hotels");
        }
        else {
            Comment.create(req.body.comment,
                function (err, comment) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.comment_on = Date.now();
                        comment.save();
                        hotel.comments.push(comment);
                        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                        // console.log(comment.comment_on);
                        // console.log(hotel);
                        hotel.save((result, err) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log(result);
                            }

                        });
                        req.flash("success", "Comment added successfully!!");
                        res.redirect('/hotels/' + hotel._id);

                    }
                });

        }
    });
});
// EDIT COMMENT ROUTES
router.get("/:comment_id/edit", midddleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { hotel_id: req.params.id, comment: foundComment });

        }
    });
});
router.put("/:comment_id", midddleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            updatedComment.comment_updated_on = Date.now();
            updatedComment.save();
            console.log(updatedComment.comment_updated_on);
            req.flash("success", "Comment Updated successfully!!");
            res.redirect("/hotels/" + req.params.id);
        }
    });
});

//Delete comment

router.delete("/:comment_id", midddleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully!!");
            res.redirect("/hotels/" + req.params.id);
        }
    });
});



module.exports = router;