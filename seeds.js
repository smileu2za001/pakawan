const mongoose = require('mongoose');
const Alphabet = require('./models/alphabet')

function seedDB() {
    Alphabet.remove({}, (err) => {
        err ? console.log(err) : console.log("Removed");
    });
}

module.exports = seedDB


// A : Apple
// https://i.ytimg.com/vi/RTfvXkEXa-k/maxresdefault.jpg
// Learn all about the letter A with our Phonics letter A song! Here comes the letter A!
