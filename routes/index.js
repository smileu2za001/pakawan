const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// ROOT ROUTE
router.get("/", (req, res) => {
    res.render("home");
});

// REGISTER ROUTE (SHOW REGISTER FORM)
router.get("/register", (req, res) => {
    res.render("register");
});
// HANDLE REGISTER LOGIC
router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username });
    let password = req.body.password;
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log("\n" + err + "\n");
            return res.render("register");
        }
        else {
            passport.authenticate('local')(req, res, () => {
                console.log("\nUser " + req.body.username + " create successful!!\n");
                res.redirect("/alphabets");
            });
        }
    });
});

// LOG-IN ROUTE (SHOW LOGIN FORM)
router.get("/login", (req, res) => {
    res.render("login");
});

// HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/alphabets",
        failureRedirect: "/login"
    }), (req, res) => {
    });

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/alphabets");
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;