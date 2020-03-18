const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://MongoDB:manager@cluster0-scu13.mongodb.net/AlphabetDB?retryWrites=true&w=majority");

// ======================================================
// ==================== SCHEMA SETUP ====================
// ======================================================

var alphabetSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Alphabet = mongoose.model("Alphabet", alphabetSchema);

// ======================================================
// ==================== INDEX ====================
// ====================================================== 

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/alphabet", (req, res) => {
    // Get all alphabet from DB
    Alphabet.find({}, (err, allAlphabets) => {
        if (err)
            console.log(err);
        else
            res.render("alphabet", { Alpha: allAlphabets });
    })
});

app.post("/alphabet", (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let newAlpha = { name: name, image: image }
    
    console.log(name + "   " + image);

    Alphabet.create(newAlpha, (err, newAlphabet) => {
        if (err)
            console.log("Error");
        else {
            console.log("NEWLY CREATED ALPHABET : ");
            console.log(newAlphabet);
        }
    })
    res.redirect("/alphabet");
});

app.get("/newalphabet", (req, res) => {
    res.render("new");
});

app.listen(3000, () => {
    console.log("server start on port 3000");
});