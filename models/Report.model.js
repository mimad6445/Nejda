const mongoose = require('mongoose');

const RaportSchema = mongoose.Schema({
    description : {type : String},
    image : [{type : String}],
    vocal : {type : String},
    video : {type : String},
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