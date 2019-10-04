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
        postedOn: {type: Date, default: Date()},
        replies: {type: [String], default: [String]}, // String Array
    })


    var UserSchema = new mongoose.Schema({
        username:{
            type: String,
            max: 15,
            unique: true,
            required: true
        },
        password: String,
        name: {
            type: String,
            max: 15
        },
        biography: {
            type: String,
            max: 150
        },
        memberSince: {type: Date, default: Date()},
        fweets: {type: [FweetSchema]}
    })
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);