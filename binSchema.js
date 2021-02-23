const mongoose = require('mongoose');

const BinSchema = mongoose.Schema({
    id: String,
    text: String,
});

module.exports = mongoose.model('bin', BinSchema);