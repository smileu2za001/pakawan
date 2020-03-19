var mongoose = require('mongoose');
var alphabetSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            text: String,
            author: String
        }
    ]
});

module.exports = mongoose.model("Alphabet", alphabetSchema);