var express = require("express");
var router = express.Router();
var passport = require("passport");
var Booking = require("../models/booking");
var midddleware = require("../middleware");
var User = require("../models/user");

//Root route 
router.get("/", function (req, res) {
    res.redirect("/hotels");
    // res.render("campgrounds/index");
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
    // var username = req.body.username;
    // var email = req.body.email;
    // var phoneno = req.body.phoneno;

    // var createUser = {
    //     firstname: firstname,
    //     lastname: lastname,
    //     username: username,
    //     email: email,
    //     phoneno: phoneno,
    // }
    var newUser = new User({ username: req.body.username });
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
});


// router.post("/login", function (req, res) {
//     var newUser = new User({ username: req.body.username });
//     User.register(newUser, req.body.password, function (err, user) {
//         if (err) {
//             req.flash("error", err.message);
//             res.redirect("register");
//         }
//         passport.authenticate("local")(req, res, function () {
//             req.flash("success", "Welcome to LakeSide :" + user.username);
//             res.redirect("/hotels");
//         });
//     });
// });


// Show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "/hotels",
//         failureRedirect: "/login",
//     }), function (req, res) {
//         // req.flash("success", "Welcome to LakeSide :" + user.username);
//         // res.redirect("/hotels");
//     });
router.post("/login", passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }), function (req, res, next) {
        // if (req.body.username == "admin") {
        //     res.redirect("/admin");
        // }
        req.flash('Username or password is incorrect');
        req.flash("success", "Welcome to LakeSide :" + req.body.username);
        // console.log(User.schema);
        // next();
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

router.get('/feedback', midddleware.isLoggedIn, (req, res, next) => {
    res.render("feedback");
});


module.exports = router;