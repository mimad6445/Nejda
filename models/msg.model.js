const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    qstModel : [{
        qst : {type : mongoose.Types.ObjectId , ref : 'qst'},
        response : {type : String}
    }],
},{timestamps: true})

msgSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("emergency").updateMany(
            { emergencies: doc._id },
            { $pull: { emergencies: doc._id } }
        );
    }
});


module.exports = mongoose.model('msg', msgSchema);