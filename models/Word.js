const mongoose = require("mongoose");

const wordschema = new mongoose.Schema({
    word:String,
    translation:String,
    definition:String,
    type:String,
    category:String,
    image:String,
    examples:[String],
    timestamp:{type:Date, default:Date.now}
});

module.exports = mongoose.model("Word", wordschema);