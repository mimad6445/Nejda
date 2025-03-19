const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    adminType : {type : String,require : true},
    name : {type : String,require : true},
    email : {type : String,require : true},
    phoneNumber : {type : String,require : true},
    password: {type: String, required:true},
    username: { type: String, unique: true, sparse: true }, 
    avatar:{type: String },
},{timestamps: true})


module.exports = mongoose.model('admins', adminSchema);
