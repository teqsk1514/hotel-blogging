var mongoose = require("mongoose");
var hotelSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    created_at: { type: Date },
    updated_at: { type: Date },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {
        usePushEach: true
    });
module.exports = mongoose.model("Hotel", hotelSchema);