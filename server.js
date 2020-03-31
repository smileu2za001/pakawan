const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Alphabet = require('./models/alphabet');
const Comment = require('./models/comment');
const User = require('./models/user');

const seedDB = require('./seeds');

const app = express();
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

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

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    next();
})
// INDEX ALPHABET
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/alphabets", (req, res) => {
    // Get all alphabet from DB
    Alphabet.find({}, (err, allAlphabets) => {
        if (err)
            cconsole.log("\n" + err + "\n");
        else
            res.render("alphabets/index", { Alpha: allAlphabets});
    })
});

app.get("/alphabets/:id", (req, res) => {
    Alphabet.findById(req.params.id, (err, foundAlphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else
            res.render("alphabets/show", { alphabet: foundAlphabet });
    })
});

// === CREATE ALPHABET ===

app.post("/alphabets", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newAlpha = { name: name, image: image, description: desc }

    console.log(name + "   " + image);

    Alphabet.create(newAlpha, (err, newAlphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else {
            console.log("NEWLY CREATED ALPHABET : ");
            console.log(newAlphabet);
        }
    })
    res.redirect("/alphabets");
});

// === NEW ALPHABET ===

app.get("/newalphabet", (req, res) => {
    res.render("alphabets/new");
});


// ============================================
// ============== COMMENTS ROUTE ============== 
// ============================================

app.get("/alphabets/:id/comments/new", isLoggedIn ,(req, res) => {
    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else
            res.render("comments/new", { alphabet: alphabet })
    })
});

app.post("/alphabets/:id/comments", (req, res) => {
    //Lookup alphabet using id
    //create new comment
    //connect new comment to alphabet
    //redirect alphabete show page

    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log("\n" + err + "\n"); 
        else {
             Comment.create(req.body.comment, (err, comment) => {
                 if (err)
                     console.log("\n" + err + "\n");
                 else {
                     alphabet.comments.push(comment);
                     alphabet.save();
                     res.redirect('/alphabets/'+ alphabet._id);
                 }
             });
        }
    });
});

// ========================================
// ============== AUTH ROUTE ============== 
// ========================================

//show registration form
app.get("/register",(req,res) => {
    res.render("register");
});
//handle registration logic
app.post("/register",(req,res)=>{
    let newUser = new User({username: req.body.username});
    let password = req.body.password;
    User.register(newUser, password, (err,user)=>{
        if(err){
            console.log("\n" + err + "\n");
            return res.render("register");
        }
        else{
            passport.authenticate('local')(req,res,()=>{
                console.log("\nUser " + req.body.username + " create successful!!\n");
                res.redirect("/alphabets");
            });
        }
    }); 
});

//show log in form
app.get("/login",(req,res) => {
    res.render("login");
});
//handle log in logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/alphabets",
        failureRedirect: "/login"
    }),(req,res)=>{
});

//logic route
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/alphabets");
})
//function isLoggedIn()
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

app.listen(3000, () => {
    console.log("server start on port 3000");
});
