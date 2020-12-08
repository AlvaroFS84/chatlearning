const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = Schema({
    title: String,
    test: { type: Schema.Types.ObjectId, ref: 'Test' },
    users: [ { user:{ type: Schema.Types.ObjectId, ref: 'User' }, ready:{type:Boolean, default:false}}],
    state: { type: String, default:'created'},
    answers: [],
    calification: { type: Number, default: 0},
    finished: Boolean
});

module.exports = mongoose.model('Game',gameSchema)