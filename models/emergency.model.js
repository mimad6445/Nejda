const mongoose = require('mongoose');

const emergencySchema = mongoose.Schema({
    emergencyType : {type : String,require : true},
    fastcall : {type : mongoose.Types.ObjectId , ref : 'fastcall'},
    msg : {type : mongoose.Types.ObjectId , ref : 'msg'},
    report : {type : mongoose.Types.ObjectId , ref : 'raport'},
    user : {type : mongoose.Types.ObjectId , ref : 'users', require : True}
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