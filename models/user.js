var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
    // firstName: String,
    // lastName: String,
    username: String,
    // email: String,
    // phone: String,
    password: String,
    notification: [{
        message: {
            type: String
        }
    }]

});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);