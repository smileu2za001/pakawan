const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Alphabet = require('./models/alphabet');
const Comment = require('./models/comment');
const seedDB = require('./seeds')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://MongoDB:manager@cluster0-scu13.mongodb.net/AlphabetDB?retryWrites=true&w=majority");

//seedDB();
// === INDEX ALPHABET ===

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/alphabets", (req, res) => {
    // Get all alphabet from DB
    Alphabet.find({}, (err, allAlphabets) => {
        if (err)
            console.log(err);
        else
            res.render("alphabets/index", { Alpha: allAlphabets });
    })
});

app.get("/alphabets/:id", (req, res) => {
    Alphabet.findById(req.params.id, (err, foundAlphabet) => {
        if (err)
            console.log(err);
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
            console.log(err);
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



// ================
//  COMMENTS ROUTE 
// ================

app.post("/alphabets/:id/comments", (req, res) => {
    //Lookup alphabet using id
    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log(err);
        else {
             Comment.create(req.body.comment, (err, comment) => {
                 if (err)
                     console.log(err);
                 else {
                     alphabet.comments.push(comment);
                     alphabet.save();
                     res.redirect('/alphabets/'+ alphabet._id);
                 }
             });
        }

    });
    //create new comment
    //connect new comment to alphabet
    //redirect alphabete show page
});


app.get("/alphabets/:id/comments/new", (req, res) => {
    Alphabet.findById(req.params.id, (err, alphabet) => {
        if (err)
            console.log(err)
        else
            res.render("comments/new", { alphabet: alphabet })
    })

});


app.listen(3000, () => {
    console.log("server start on port 3000");
});