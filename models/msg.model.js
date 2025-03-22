const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    emergencyType: {
        type: String,
        enum: ['حريق','حادث مرور','حالة مرضية','انتحار','إنتحار','فيضانات','البحث عن مفقود','اختطاف','إختطاف','تحت التهديد','التهديد الإلكتروني','جريمة قتل','سرقة','تهديد','تهريب','جرائم إلكترونية'],
        required: true
    },
    msg : {type : String},
    Needs : {type : String, enum: ['الشرطة', 'الدرك', 'اسعاف','إسعاف']},
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