var mongoose = require("mongoose");
var Hotel = require("./models/hotel");
var Comment = require("./models/comment");
var data = [
    {
        name: "Hotel1",
        image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
        description: "Located in the heart of Bangalore, Capital O 15859 Silverstar promises a great experience to the guests at affordable rates. The hospitable and friendly staff of OYO ensures your stay is pleasant."
    },
    {
        name: "Hotel2",
        image: "https://images.pexels.com/photos/573552/pexels-photo-573552.jpeg",
        description: "Located in the heart of Bangalore, Capital O 15859 Silverstar promises a great experience to the guests at affordable rates. The hospitable and friendly staff of OYO ensures your stay is pleasant."
    },
    {
        name: "Hotel3",
        image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
        description: "Located in the heart of Bangalore, Capital O 15859 Silverstar promises a great experience to the guests at affordable rates. The hospitable and friendly staff of OYO ensures your stay is pleasant."
    }
]
function seedDB() {
    Hotel.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed hotels! ");
        //add a few Hotels
        data.forEach(function (seed) {
            Hotel.create(seed, function (err, hotel) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Added a hotel!");
                    //create a comment
                    Comment.create(
                        {
                            author: "Sam ",
                            text: "This place is great,but I wish there was Internet"

                        }, function (err, comment) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                hotel.comments.push(comment);
                                hotel.save();
                                console.log("Created new comments!");
                            }
                        });
                }
            });
        });
    });


}

module.exports = seedDB;