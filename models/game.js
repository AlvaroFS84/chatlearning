const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Constructor
 */
const gameSchema = Schema({
    title: String,
    test: { type: Schema.Types.ObjectId, ref: 'Test' },
    users: [ { user:{ type: Schema.Types.ObjectId, ref: 'User' }, ready:{type:Boolean, default:false}}],
    state: { type: String, default:'created'},
    answers: [],
    calification: { type: Number, default: 0},
    creationDate: {type:Date, default: Date.now()},
    finished: Boolean
});

module.exports = mongoose.model('Game',gameSchema)