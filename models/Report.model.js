const mongoose = require('mongoose');

const RaportSchema = mongoose.Schema({
    description : {type : String},
    Needs : {type : String, enum: ['الشرطة', 'الدرك', 'إسعاف','اسعاف']},
},{timestamps: true})

RaportSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("emergency").updateMany(
            { emergencies: doc._id },
            { $pull: { emergencies: doc._id } }
        );
    }
});


module.exports = mongoose.model('raport', RaportSchema);