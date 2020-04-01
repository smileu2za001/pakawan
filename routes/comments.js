const express = require('express');
const moment = require('moment');
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
    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err)
                    console.log("\n" + err + "\n");
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.date = moment().format('YYYYMMDD , HH:mm:ss');
                    comment.save();
                    
                    alphabet.comments.push(comment);
                    alphabet.save();
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