var mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
        text: String,
        comment_on: { type: Date },
        comment_updated_on: { type: Date },
        author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                },
                username: String
        }

});

module.exports = mongoose.model("Comment", commentSchema); 