var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

    var FweetSchema = new mongoose.Schema({
        subject:{
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        replies: {type: [String], default: [String]}, // String Array
    })
FweetSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Fweet", FweetSchema);