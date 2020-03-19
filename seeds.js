const mongoose = require('mongoose');
const Alphabet = require('./models/alphabet')

function seedDB() {
    Alphabet.remove({}, (err) => {
        err ? console.log(err) : console.log("Removed");
    });
}

module.exports = seedDB