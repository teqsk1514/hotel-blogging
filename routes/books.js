var express = require("express");
var router = express.Router({ mergeParams: true });
var Hotel = require("../models/hotel");
var Comment = require("../models/comment");
var Booking = require("../models/booking");
var midddleware = require("../middleware");
//Comments New


router.get("/", midddleware.isLoggedIn, function (req, res) {
    Hotel.findById(req.params.id, function (err, hotel) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("booking/bookhotel", { hotel: hotel, user: req.user });
        }
    });
});



router.post("/", midddleware.isLoggedIn, function (req, res) {
    Hotel.findById(req.params.id, function (err, hotel) {
        if (err) {
            console.log(err);
            res.redirect("/hotels");
        }
        else {
            var phoneno = req.body.phoneno;
            var address = req.body.address;
            var newBooking = {
                phoneno: phoneno,
                address: address,
            }
            Booking.create(newBooking, function (err, newlyAdded) {
                if (err) {
                    console.log(err);
                }
                else {
                    newlyAdded.author.id = req.user._id;
                    newlyAdded.author.username = req.user.username;
                    newlyAdded.hotel.id = hotel._id;
                    newlyAdded.hotel.name = hotel.name;
                    newlyAdded.hotel.price = hotel.price;
                    newlyAdded.hotel.image = hotel.image;
                    newlyAdded.booked_on = Date.now();
                    newlyAdded.save();
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                    // console.log(newlyAdded);
                    req.flash("success", "Booked successfully!! Your Booking Id is:->" + newlyAdded._id);
                    res.redirect('/hotels/' + hotel._id);

                }
            });

        }
    });
    // var hotel_id = req.body.hotelid;
    // var hotel_name = req.body.hotelname;
    // var hotel_price = req.body.hotelprice;
    // var user_id = req.body.hotelid;
    // var user_name = req.body.username;
    // var phoneno = req.body.phoneno;
    // var address = req.body.address;

    // var newBooking = { hotel_id: hotel_id, hotel_name: hotel_name, hotel_price: hotel_price, user_id: user_id, user_name: user_name, phoneno: phoneno, address: address }
    // //add a new booking and save it to the database
    // Booking.create(newBooking, function (err, newlyAdded) {
    //     if (err) {
    //         req.flash("error", "Not added");
    //     }
    //     else {
    //         console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    //         console.log(newlyAdded);
    //         req.flash("success", "Booked Suceesfully!! Your Booking Id is" + newlyAdded._id);
    //         res.redirect("/hotels");
    //     }

    // });
});
module.exports = router;