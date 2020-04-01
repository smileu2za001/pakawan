const express = require('express');
const router = express.Router();
const Alphabet = require('../models/alphabet');

// INDEX - (SHOW ALL ALPHABETS)
router.get("/", (req, res) => {
    // Get all alphabet from DB
    Alphabet.find({}, (err, allAlphabets) => {
        if (err)
            cconsole.log("\n" + err + "\n");
        else
            res.render("alphabets/index", { Alpha: allAlphabets });
    })
});

// CREATE - (ADD NEW ALHPABETS TO DATABASE)
router.post("/", (req, res) => {
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

// NEW - (SHOW FORM TO CREATE NEW ALPHABETS)
router.get("/new", (req, res) => {
    res.render("alphabets/new");
});

// SHOW - (SHOW MORE INFO ABOUT ONE ALPHABETS)
router.get("/:id", (req, res) => {
    Alphabet.findById(req.params.id, (err, foundAlphabet) => {
        if (err)
            console.log("\n" + err + "\n");
        else
            res.render("alphabets/show", { alphabet: foundAlphabet });
    })
});

module.exports = router;