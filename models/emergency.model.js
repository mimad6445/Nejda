const mongoose = require('mongoose');

const emergencySchema = mongoose.Schema({
    emergencyType :  {type : String, enum: ['fastcall', 'raport','msg']},
    Needs : {type : String, enum: ['الشرطة', 'الدرك', 'اسعاف','إسعاف']},
    fastcall  : {type : mongoose.Types.ObjectId , ref : 'fastcall'},
    msg : {type : mongoose.Types.ObjectId , ref : 'msg'},
    report : {type : mongoose.Types.ObjectId , ref : 'raport'},
    user : {type : mongoose.Types.ObjectId , ref : 'users', require : true},
    gps : {type : String},
    status :{type: Boolean,default:false}
},{timestamps: true})

emergencySchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("User").updateMany(
            { emergencies: doc._id },
            { $pull: { emergencies: doc._id } }
        );
    }
});


module.exports = mongoose.model('emergency', emergencySchema);