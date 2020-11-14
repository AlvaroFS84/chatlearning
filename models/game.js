const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = Schema({
    title: String,
    test: { type: Schema.Types.ObjectId, ref: 'Test' },
    users: [ { user:{ type: Schema.Types.ObjectId, ref: 'User' }, calification: Number }],
    state: [],
    finished: Boolean
});

module.exports = mongoose.model('Game',gameSchema)