var express = require("express");
var router = express.Router();
var passport = require("passport");
var Hotel = require("../models/hotel");
var Booking = require("../models/booking");
var midddleware = require("../middleware");
var User = require("../models/user");
var Feedback = require("../models/feedback");
const isEmpty = require('../validation/is-empty');
const Validator = require('validator');

//Root route 
router.get("/", function (req, res, next) {
    //Get All rooms from DB
    Hotel.find({}, function (err, allhotels) {
        if (err) {
            console.log(err);
        }
        else {
            const imageUrl = allhotels.map(hotel => {
                return {
                    image: hotel.image,
                    name: hotel.name
                };
            })
            res.render("campgrounds/index", {
                hotels: allhotels,
                images: imageUrl.slice(0, 6),
                currentUser: req.user
            });
        }

    });

});
//SHOW REGISTER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

// show booking information
router.get('/booked', midddleware.isLoggedIn, (req, res) => {
    Booking.find({ 'author.username': req.user.username }, (err, found) => {
        if (err) {
            console.log(err);
            res.redirect("/hotels");
        }
        else {
            console.log(req.user);
            // console.log(found.reverse());
            res.render('booking/booked', { user: req.user.username, bookingDetails: found, len: found.length });
        }
    });

});
//handles signup logic
router.post("/register", function (req, res) {
    // var firstname = req.body.firstname;
    // var lastname = req.body.lastname;
    var username = req.body.username;
    // var email = req.body.email;
    // var phoneno = req.body.phoneno;

    // var createUser = {
    //     firstname: firstname,
    //     lastname: lastname,
    //     username: username,
    //     email: email,
    //     phoneno: phoneno,
    // }

    let errors = {};

    if (!Validator.isEmail(username)) {
        errors.email = 'Not a valid Email Id';
    }
    console.log(errors);

    const isValid = isEmpty(errors);

    if (!isValid) {
        req.flash("error", errors.email);
        res.redirect("/register");
    } else {
        var newUser = new User({
            username: username,
        });
        // var newUser = new User(createUser);
        // console.log(createUser);
        // console.log('__________________________________________________________________--');
        // console.log(newUser);
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("register");
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    req.flash("success", "Welcome to LakeSide :" + user.username);
                    res.redirect("/hotels");
                });
            }
        });
    }
});


// Show login form
router.get("/login", function (req, res) {
    res.render("login");
});
// router.get("/login", function (req, res) {
//     res.render("new-login");
// });
// 
router.post("/login", passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }), function (req, res, next) {
        console.log(req.body);
        req.flash('Username or password is incorrect');
        req.flash("success", "Welcome to LakeSide :" + req.body.username);
        res.redirect("/hotels");
    });


router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/hotels");
});




router.get('/raise', midddleware.isLoggedIn, (req, res, next) => {
    res.render("raise");
});

router.get('/feedback', (req, res, next) => {
    res.render("feedback");
});

router.post('/feedback', (req, res, next) => {
    const feedbackData = req.body;
    // console.log(feedbackData);
    const feedback = new Feedback(feedbackData);
    feedback.save()
        .then(result => {
            console.log("Your feedback has been saved!");
            req.flash("success", "Thanks for your feedback We will get back soon!");
            res.redirect("/hotels");
        })
        .catch(err => {
            console.log(err);
        });

});


module.exports = router;