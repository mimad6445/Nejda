const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    emergencyType: {
        type: String,
        enum: ['جريمة قتل', 'اعتداء', 'اختطاف', 'حريق', 'حادث', 'مرض', 'حالة نفسية', 'حالة اخرى'],
        required: true
    },
    msg : {type : String},
    injured : {type : Boolean, require : true},
    inTheSence : {type : Boolean, require : true},
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