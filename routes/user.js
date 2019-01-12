var express = require("express");
var router = express.Router();
var midddleware = require("../middleware");
var Hotel = require("../models/hotel");

router.get("/profile", midddleware.isLoggedIn, function (req, res) {
    Hotel.find({ 'author.username': req.user.username }, (err, found) => {
        if (err) {
            console.log(err);
            res.redirect("/hotels");
        }
        else {
            console.log(found);
            // console.log(found.reverse());
            res.render('user/profile', { user: req.user.username, userHotelDetails: found, len: found.length });
        }
    });
});



router.get("/profile/edit", midddleware.isLoggedIn, (req, res, next) => {

    res.render('user/edit');

});
router.post("/profile/edit", midddleware.isLoggedIn, (req, res, next) => {

    res.render('user/edit');

});

module.exports = router;
