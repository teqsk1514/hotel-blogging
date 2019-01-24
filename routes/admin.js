var express = require("express");
var router = express.Router();
var Booking = require("../models/booking");
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var User = require("../models/user");
var Admin = require("../models/admin");
var midddleware = require("../middleware");
var User = require("../models/user");
var Feedback = require("../models/feedback");



router.get("/", function (req, res) {
    // console.log(req.user);
    Admin.find()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            throw err;
        });
    res.render("admin/index");
    // res.redirect('/hotels');
});

router.post('/', midddleware.isAdminLoggedIn, (req, res, next) => {
    console.log(req.body.username);
    Admin.findOne({ username: req.body.username })
        .then(result => {
            console.log(result);
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
        });
});

// router.get('/create', (req, res, next) => {
//     var newAdmin = new Admin({ username: 'ravisk1514' });
//     Admin.register(newAdmin, '123456', function (err, admin) {
//         if (err) {
//             req.flash("error", err.message);
//             res.redirect("/admin");
//         }
//         else {
//             console.log(admin);
//             passport.authenticate("local")(req, res, function () {
//                 req.flash("success", "Welcome to LakeSide :" + admin.username);
//                 res.redirect("/admin/hotels");
//             });
//         }
//     });
// })

router.get("/hotels", midddleware.isAdminLoggedIn, function (req, res) {
    Hotel.find()
        .then((hotels) => {
            console.log(hotels);
            res.render("admin/hotels", { hotels: hotels });
        })
        .catch(err => {
            throw err;
        });

});

router.get('/hotel/delete/:id', midddleware.isAdminLoggedIn, (req, res) => {
    Hotel.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Hotel deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/hotels");
    })
});

router.get("/bookings", midddleware.isAdminLoggedIn, function (req, res) {
    Booking.find()
        .then((bookings) => {
            // console.log(bookings);
            res.render("admin/bookings", { bookings: bookings });
        })
        .catch(err => {
            throw err;
        });
});

router.get('/booking/delete/:id', midddleware.isAdminLoggedIn, (req, res) => {
    Booking.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Booking deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/bookings");
    })
});


router.get("/comments", midddleware.isAdminLoggedIn, function (req, res) {
    Comment.find()
        .then((comments) => {
            // console.log(comments);
            res.render("admin/comments", { comments: comments });
        })
        .catch(err => {
            throw err;
        });
});

router.get('/comment/delete/:id', midddleware.isAdminLoggedIn, (req, res) => {
    Comment.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Comment deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/comments");
    })
});


// router.get("/users", function (req, res) {
//     User.find()
//         .then((users) => {
//             console.log(users);
//             res.render("admin/users", { users: users });
//         })
//         .catch(err => {
//             throw err;
//         });
// });

router.get("/users", midddleware.isAdminLoggedIn, function (req, res) {
    User.find()
        .then((users) => {
            console.log(users);
            res.render("admin/users", { users: users });
        })
        .catch(err => {
            throw err;
        });
});


router.get("/feedback", midddleware.isAdminLoggedIn, function (req, res) {
    Feedback.find()
        .then((feedbacks) => {
            console.log(feedbacks);
            res.render("admin/feedback", { feedbacks: feedbacks });
        })
        .catch(err => {
            throw err;
        });
});

router.get('/feedback/delete/:id', midddleware.isAdminLoggedIn, (req, res) => {
    Feedback.findByIdAndRemove(req.params.id, (err, found) => {
        if (err) return res.status(500).send(err);
        req.flash("success", "Feedback deleted!!! and the id is  " + req.params.id);
        res.redirect("/admin/feedback");
    })
});


router.get("/notification", midddleware.isAdminLoggedIn, function (req, res) {
    res.render('admin/sendingNotification');
});


router.post("/notification", midddleware.isAdminLoggedIn, function (req, res) {
    console.log(req.body);

    User
        .findById(req.body.userId)
        .then(user => {
            // console.log(user.notification);
            const newNotification = { message: req.body.message };
            updatedNotification = [...user.notification, newNotification];
            console.log(updatedNotification);

            User
                .updateOne({ _id: req.body.userId }, { $set: { notification: updatedNotification } })
                .then(user => {
                    console.log(user);
                })
                .catch(err => {
                    console.log(err)
                })
        })
        .catch(err => {
            console.log(err)
        });


    // User
    //     .updateOne({ _id: req.body.userId }, { $set: { notification: [{ message: req.body.message }] } })
    //     .then(user => {
    //         console.log(user);
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    res.redirect('/admin/notification');
});



module.exports = router;