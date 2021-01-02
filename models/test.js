const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Constructor
 */
const testSchema = Schema({
    title: String,
    questions: [],
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Test',testSchema)