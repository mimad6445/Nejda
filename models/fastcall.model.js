const mongoose = require('mongoose');

const fastcallSchema = mongoose.Schema({
    image : [{type : String}],
    vocal : {type : String},
    video : {type : String},
    Needs : {type : String, enum: ['الشرطة', 'الدرك', 'إسعاف']},
},{timestamps: true})

fastcallSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("emergency").updateMany(
            { emergencies: doc._id },
            { $pull: { emergencies: doc._id } }
        );
    }
});


module.exports = mongoose.model('fastcall', fastcallSchema);