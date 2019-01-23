var express = require("express");
var router = express.Router();
var Hotel = require("../models/hotel");
var midddleware = require("../middleware");
var Comment = require("../models/comment");
const Validator = require('validator');
const isEmpty = require('../validation/is-empty');

//INDEX-show all hotels
router.get("/", function (req, res, next) {
    // console.log(req.user);
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
            // console.log(imageUrl.slice(0, 6));
            console.log(imageUrl.slice(0, 6));
            // next();
            res.render("campgrounds/index", {
                hotels: allhotels,
                images: imageUrl.slice(0, 6),
                currentUser: req.user
            });
        }

    });

})
//CREATE-add new hotels to database
router.post("/", midddleware.isLoggedIn, function (req, res, next) {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const created_at = Date.now();
    const author = {
        id: req.user._id,
        username: req.user.username
    }

    let errors = {};

    if (!Validator.isURL(image)) {
        errors.image = 'Not a valid image url';
    }

    if (!Validator.isLength(desc, { min: 10, max: 300 })) {
        errors.desc = 'Description should be in between 10 and 300 character';
    }
    console.log(errors);

    const isValid = isEmpty(errors);

    if (!isValid) {
        req.flash("error", errors.image);
        req.flash("error", errors.desc);
        res.redirect("/hotels/new");
    } else {
        const newHotel = { name: name, price: price, image: image, description: desc, author: author, created_at: created_at }
        //add a new room and save it to the database
        Hotel.create(newHotel, function (err, newlyAdded) {
            if (err) {
                req.flash("error", "Not added");
            } else {
                // console.log(newlyAdded);
                req.flash("success", "Hotel added Suceesfully!!");
                res.redirect("/hotels");
            }

        });
    }
});
//NEW-show form to add new hotels
router.get("/new", midddleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
//SHOW-shows more info about one hotel
router.get("/:id", function (req, res) {
    Hotel.findById(req.params.id).populate("comments").exec(function (err, foundHotel) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log(foundHotel);
            // console.log("############################################################");
            res.render("campgrounds/show", { hotel: foundHotel });
        }
    });
});

//EDIT HOTEL ROUTE
router.get("/:id/edit", midddleware.checkHotelOwnership, function (req, res) {
    Hotel.findById(req.params.id, function (err, foundHotel) {
        res.render("campgrounds/edit", { hotel: foundHotel, hid: req.params.id });
    });
});


//UPDATE CAMPGROUND 
router.put("/:id", midddleware.checkHotelOwnership, function (req, res) {
    //find and update
    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function (err, updatedHotel) {
        if (err) {
            res.redirect("/hotels");
        }
        else {
            updatedHotel.updated_at = Date.now();
            updatedHotel.save();
            req.flash("success", "Updated Sucessfully");
            res.redirect("/hotels/" + req.params.id);
        }
    });
});
//Delete Campground
router.delete("/:id", midddleware.checkHotelOwnership, function (req, res) {
    Hotel.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/hotels");
        }
        else {
            req.flash("error", "Hotel Removed successfully!!");
            res.redirect("/hotels");
        }
    });
});

module.exports = router;