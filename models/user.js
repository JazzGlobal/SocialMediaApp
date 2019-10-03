var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Fweet = require('./fweet');
    
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


    var UserSchema = new mongoose.Schema({
        username:{
            type: String,
            unique: true,
            required: true
        },
        password: String,
        name: String,
        memberSince: {type: Date, default: Date()},
        fweets: {type: [FweetSchema]}
    })
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);