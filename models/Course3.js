var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    id : Number,
    courseSearcH: String,
    course : String,
    university : String,
    link : String,
    instructor : String,
    university : String
});

module.exports = mongoose.model('Course', courseSchema);