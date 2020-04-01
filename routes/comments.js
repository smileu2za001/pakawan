const express = require('express');
const router = express.Router({ mergeParams: true }); // NOT USE MERGE PARAM IF PATH FULL
const Alphabet = require('../models/alphabet');
const Comment = require('../models/comment');

// COMMENT NEW
router.get('/new', isLoggedIn, (req, res) => {

    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else
            res.render("comments/new", { alphabet: alphabet })
    })
});

// COMMENT CREATE
router.post('/', (req, res) => {
    //Lookup alphabet using id
    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err)
                    console.log("\n" + err + "\n");
                else {
                    //connect new comment to alphabet
                    alphabet.comments.push(comment);
                    alphabet.save();
                    //redirect alphabete show page
                    res.redirect('/alphabets/' + alphabet._id);
                }
            });
        }
    });
});

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};


module.exports = router;