var express = require("express");
var router = express.Router();
var passport = require("passport");
var Booking = require("../models/booking");
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var User = require("../models/user");
var midddleware = require("../middleware");
var User = require("../models/user");



router.get("/", function (req, res) {
    // res.render("admin/index");
    res.redirect('/admin/hotels');
});


router.get("/hotels", function (req, res) {
    Hotel.find()
        .then((hotels) => {
            console.log(hotels);
            res.render("admin/hotels", { hotels: hotels });
        })
        .catch(err => {
            throw err;
        });

});

router.get('/hotel/delete/:id', (req, res) => {
    Hotel.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Hotel deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/hotels");
    })
});

router.get("/bookings", function (req, res) {
    Booking.find()
        .then((bookings) => {
            // console.log(bookings);
            res.render("admin/bookings", { bookings: bookings });
        })
        .catch(err => {
            throw err;
        });
});

router.get('/booking/delete/:id', (req, res) => {
    Booking.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Booking deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/bookings");
    })
});


router.get("/comments", function (req, res) {
    Comment.find()
        .then((comments) => {
            // console.log(comments);
            res.render("admin/comments", { comments: comments });
        })
        .catch(err => {
            throw err;
        });
});

router.get('/comment/delete/:id', (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Comment deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/comments");
    })
});


router.get("/users", function (req, res) {
    User.find()
        .then((users) => {
            console.log(users);
            res.render("admin/users", { users: users });
        })
        .catch(err => {
            throw err;
        });
});


module.exports = router;