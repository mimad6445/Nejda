const FastCall = require("../models/fastcall.model");
const userdb = require("../models/user.model")
const httpStatusText = require("../utils/httpStatusText");
const emergencyModel = require("../models/emergency.model");
// Create FastCall
const createFastCall = async (req, res) => {
    try {
        const userid = req.params.userid;
        const io = req.app.get('socketio');
        const user = await userdb.findById(userid);
            if(!user){
                return res.status(404).json({ status: httpStatusText.FAIL, message: "user not exist" });
            }

        const imageFiles = req.files["image"] ? req.files["image"].map(file => file.filename) : [];
        const vocalFile = req.files["vocal"] ? req.files["vocal"][0].filename : "";
        const videoFile = req.files["video"] ? req.files["video"][0].filename : "";
        
        if(!vocalFile && !videoFile && imageFiles.length === 0){
            return res.status(400).json({status : httpStatusText.FAIL, message: "At least one file is required" });
        }
        
        if(!req.body.Needs){
            return res.status(400).json({status : httpStatusText.FAIL, message: "Needs is required" });
        }

        const newFastCall = new FastCall({
            image: imageFiles,
            vocal: vocalFile,
            video: videoFile,
            Needs : req.body.Needs,
        });
        
        const newEmergency = new emergencyModel({
            emergencyType : "fastcall",
            fastcall : newFastCall._id,
            user : userid,
            Needs : req.body.Needs,
            gps : req.body.gps,
        })
        user.emergencies.push(newEmergency._id);
        await user.save();
        await newEmergency.save();
        await newFastCall.save();
        io.emit('newFact', newFastCall);
        return res.status(201).json({status :httpStatusText.SUCCESS, message: "FastCall created successfully", data: newFastCall });
    } catch (error) {
        console.log(error);
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Get All FastCalls
const getAllFastCalls = async (req, res) => {
    try {
        const fastCalls = await FastCall.find().lean();
        return res.status(200).json({status : httpStatusText.SUCCESS, data: fastCalls });
    } catch (error) {
        console.log(error);
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Get Single FastCall
const getFastCallById = async (req, res) => {
    try {
        const fastCall = await FastCall.findById(req.params.id);
        if (!fastCall) return res.status(404).json({ status : httpStatusText.FAIL , error: "FastCall not found" });

        return res.status(200).json({ status : httpStatusText.SUCCESS , data: fastCall });
    } catch (error) {
        return res.status(500).json({ status : httpStatusText.ERROR , error: "Internal Server Error", details: error });
    }
};

// Update FastCall
const updateFastCall = async (req, res) => {
    try {
        const fastCall = await FastCall.findById(req.params.id);
        if (!fastCall) return res.status(404).json({status : httpStatusText.FAIL, error: "FastCall not found" });

        if(!fastCall.image) fastCall.image = [];
        if(!fastCall.vocal) fastCall.vocal = "";
        if(!fastCall.video) fastCall.video = "";

        const imageFiles = req.files["image"] ? req.files["image"].map(file => file.filename) : fastCall.image;
        const vocalFile = req.files["vocal"] ? req.files["vocal"][0].filename : fastCall.vocal;
        const videoFile = req.files["video"] ? req.files["video"][0].filename : fastCall.video;

        fastCall.image = imageFiles;
        fastCall.vocal = vocalFile;
        fastCall.video = videoFile;

        await fastCall.save();
        return res.status(200).json({status : httpStatusText.SUCCESS, message: "FastCall updated successfully", data: fastCall });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Delete FastCall
const deleteFastCall = async (req, res) => {
    try {
        const fastCall = await FastCall.findByIdAndDelete(req.params.id);
        if (!fastCall) return res.status(404).json({status : httpStatusText.FAIL, error: "FastCall not found" });

        return res.status(200).json({status : httpStatusText.SUCCESS, message: "FastCall deleted successfully" });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

const getFastCallByUser = async (req, res) => {
    try {
        const { userid } = req.params;

        const fastCalls = await emergencyModel.find({ user: userid , emergencyType:'fastcall' }).lean();

        if (!fastCalls.length) {
            return res.status(404).json({status : httpStatusText.FAIL, message: "No FastCalls found for this user" });
        }

        return res.status(200).json({status : httpStatusText.SUCCESS, data: fastCalls });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

module.exports = {
    createFastCall,
    getAllFastCalls,
    getFastCallById,
    updateFastCall,
    deleteFastCall,
    getFastCallByUser
};
