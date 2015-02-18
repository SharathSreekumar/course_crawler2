var mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
    id : Number,
    headline : String,
    link : String
});

module.exports = mongoose.model('News', newsSchema);