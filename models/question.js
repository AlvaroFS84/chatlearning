const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Constructor
 */
const questionSchema = Schema({
    _test: { type: Number, ref: 'Test' },
    text: String,
    answers: [{
        answer_text: String,
        type: Boolean
    }],
});


module.exports = mongoose.model('Question',questionSchema)