var express = require("express");
var router = express.Router();
var passport = require("passport");
var Booking = require("../models/booking");
var midddleware = require("../middleware");
var User = require("../models/user");



router.get("/", function (req, res) {
    res.render("admin/index");
});


module.exports = router;