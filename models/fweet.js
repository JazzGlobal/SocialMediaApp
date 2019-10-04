var mongoose = require('mongoose')
    var FweetSchema = new mongoose.Schema({
        subject:{
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        postedOn: {type: Date, default: Date()},
        replies: {type: [String], default: [String]}, // String Array
    })

module.exports = mongoose.model("Fweet", FweetSchema);