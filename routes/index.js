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
            res.render('booking/booked', { user: req.user.username, bookingDetails: found, len: found.length });
        }
    });

});
//handles signup logic
router.post("/register", function (req, res) {
    const username = req.body.username;

    let errors = {};

    if (!Validator.isEmail(username)) {
        errors.email = 'Not a valid Email Id';
    }

    const isValid = isEmpty(errors);

    if (!isValid) {
        req.flash("error", errors.email);
        res.redirect("/register");
    } else {
        var newUser = new User({
            username: username,
        });
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("register");
            }
            else {
                // console.log(user);

                User
                    .findById(user._id)
                    .then(user => {
                        // console.log(user.notification);
                        const newNotification = { message: 'Welcome to LakeSide' };
                        updatedNotification = [...user.notification, newNotification];
                        console.log(updatedNotification);

                        User
                            .updateOne({ _id: user._id }, { $set: { notification: updatedNotification } })
                            .then(result => {
                                console.log(result);
                                passport.authenticate("local")(req, res, function () {
                                    req.flash("success", "Welcome to LakeSide :" + user.username);
                                    res.redirect("/hotels");
                                });
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
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
        // console.log(req.body);
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

router.get('/notification', midddleware.isLoggedIn, (req, res, next) => {
    // console.log(req.user.notification.length);
    res.render("user/notification", {
        notifications: req.user.notification,
        notificationlen: req.user.notification.length
    });
});

router.post('/notification', midddleware.isLoggedIn, (req, res, next) => {
    console.log(req.body);
    User.findById(req.user._id)
        // .updateOne({ _id: req.user._id }, { $pullAll: { notification: [{ _id: req.body.not_id }] } })
        .then(user => {
            console.log(user);
            console.log('----------------------------------------------------------');
            const updatedNotification = user.notification.filter(noti => noti._id.toString() !== req.body.not_id);
            // const updatedUserInfo = {
            //     ...user._doc,
            //     notification: updatedNotification
            // }
            return User.findByIdAndUpdate(req.user._id, { $set: { notification: updatedNotification } })
        })
        .then(result => {
            console.log('result');
            console.log(result);
            res.redirect('/notification');
        })
        .catch(err => {
            console.log(err);
        })
})


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