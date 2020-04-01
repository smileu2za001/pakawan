// REQUIRE FRAMEWORK
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const moment = require('moment');
const app = express();

// REQUIRING ROUTE
const commentRoutes = require('./routes/comments.js')
const indexRoutes = require('./routes/index.js')
const alphabetRoutes = require('./routes/alphabets.js')

// MONGOOSE MODELS
const Alphabet = require('./models/alphabet');
const Comment = require('./models/comment');
const User = require('./models/user');

// DELETE ALL DATABASE
const seedDB = require('./seeds');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// MONGOOSE CONFIGURATION
var hostDB = "mongodb+srv://MongoDB:manager@cluster0-scu13.mongodb.net/AlphabetDB"; //?retryWrites=true&w=majority
mongoose.connect(hostDB);

/* seedDB(); */

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Once Again Rusty",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// USER CONFIGURATION
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

// USE ROUTING
app.use('/', indexRoutes);
app.use('/alphabets', alphabetRoutes);
app.use('/alphabets/:id/comments', commentRoutes);

// SERVER/PORT CONFIGURATION
app.listen(3000, () => {
    console.log("\nserver start on port 3000");
    var a = "20200331 , 11:34:03";
    var c = moment(a, "YYYYMMDD , HH:mm:ss").fromNow();
    console.log(c + "\n");
});
