const mongoose = require('mongoose');

const users = mongoose.Schema({
    fullName : {type : String,require : true},
    email : {type : String,require : true},
    phoneNumber : {type : String,require : true},
    password : {type : String,require: true},
    image : {type : String},
    token : {type : String,require : true},
    emergencies : [{type : mongoose.Types.ObjectId , ref : 'emergency'}]
},{timestamps: true})


module.exports = mongoose.model('users', users);