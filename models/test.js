const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = Schema({
    title:String,
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
});


module.exports = mongoose.model('Test',testSchema)