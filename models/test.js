const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = Schema({
    title: String,
    questions: [],
    user: Schema.Types.ObjectId
});


module.exports = mongoose.model('Test',testSchema)