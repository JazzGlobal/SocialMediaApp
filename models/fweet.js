var mongoose = require('mongoose'),
    User = require('./user');
    var Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;
    
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
        owner: ObjectId,
        replies: {type: [this]} // String Array
    })

module.exports = mongoose.model("Fweet", FweetSchema);