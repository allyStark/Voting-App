var mongoose = require('mongoose');

var PollSchema = mongoose.Schema({
    question: {
        type: String,
        index: true
    },
    answers: {
        type: Object
    },
    author: {
        type: String
    }
});



var Poll = module.exports = mongoose.model('Poll', PollSchema);