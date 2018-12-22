var mongoose = require("mongoose");
var bookingSchema = mongoose.Schema({
    phoneno: String,
    address: String,
    booked_on: { type: Date },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    hotel: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        },
        name: String,
        price: String,
        image: String,
    }
});

module.exports = mongoose.model("Booking", bookingSchema); 