var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    Hotel = require("./models/hotel"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    Comment = require("./models/comment")

var commentRoutes = require("./routes/comments"),
    hotelRoutes = require("./routes/hotels"),
    indexRoutes = require("./routes/index"),
    bookRoutes = require("./routes/books"),
    adminRoutes = require("./routes/admin"),
    userRoutes = require("./routes/user");

// mongoose.connect('mongodb://localhost/hotel_web', {
//     useMongoClient: true,
//     // useNewUrlParser: true,
// }, () => {
//     console.log('connected to mongodb');
// });
// mongoose.connect(`mongodb://ravi:teqsk1514@ds237700.mlab.com:37700/hotel`, { useNewUrlParser: true }, (err, done) => {
mongoose.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds237700.mlab.com:37700/${process.env.MONGO_DB}`, { useNewUrlParser: true }, (err, done) => {
    if (err) {
        console.log(err);
        console.log('Not connected to mlab');
    }
    if (done) {

        console.log('connected to mlab');
    }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret: "Once again I am the best",
    resave: false,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/hotels/:id/comments", commentRoutes);
app.use("/hotels/:id/book", bookRoutes);
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/hotels", hotelRoutes);

app.listen(3000, () => {
    console.log('###################')
    console.log("The Hotel website server has been started", 3000);
});