const mongoose = require('mongoose');

const QstSchema = new mongoose.Schema({
    Qustions: { type: String, required: true },
    type: { type: Number, enum: [0, 1, 2], required: true },
    enumReponse : {type : Array},
}, { timestamps: true });

module.exports= mongoose.model('QstModel', QstSchema);