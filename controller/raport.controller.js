const Raport = require("../models/Report.model");
const userdb = require("../models/user.model")
const httpStatusText = require("../utils/httpStatusText");
const emergencyModel = require("../models/emergency.model");
// Create Raport
const createRaport = async (req, res) => {
    try {
        const io = req.app.get('socketio');
        const userid = req.params.userid;
        const user = await userdb.findById(userid);
            if(!user){
                return res.status(404).json({ status: httpStatusText.FAIL, message: "user not exist" });
            }
        if(!req.body.description || !req.body.Needs){
            return res.status(400).json({status : httpStatusText.FAIL, message: "description is required" });
        }
        const newRaport = new Raport({
            description: req.body.description,
            Needs : req.body.Needs,
        });
        const newEmergency = new emergencyModel({
            emergencyType : "raport",
            report : newRaport._id,
            user : userid,
            Needs : req.body.Needs,
            gps : req.body.gps,
        })
        user.emergencies.push(newEmergency._id);
        await user.save();
        await newEmergency.save();
        await newRaport.save();
        io.emit('newFact', newRaport);
        return res.status(201).json({status : httpStatusText.SUCCESS, message: "Raport created successfully", data: newRaport });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Get All Raports
const getAllRaports = async (req, res) => {
    try {
        const raports = await Raport.find().lean();
        return res.status(200).json({status : httpStatusText.SUCCESS, data: raports });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Get Single Raport
const getRaportById = async (req, res) => {
    try {
        const raport = await Raport.findById(req.params.id);
        if (!raport) return res.status(404).json({status : httpStatusText.FAIL, error: "Raport not found" });

        return res.status(200).json({status : httpStatusText.SUCCESS, data: raport });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Update Raport
const updateRaport = async (req, res) => {
    try {
        const raport = await Raport.findById(req.params.id);
        if (!raport) return res.status(404).json({status : httpStatusText.FAIL, error: "Raport not found" });

        const imageFiles = req.files["image"] ? req.files["image"].map(file => file.filename) : raport.image;
        const vocalFile = req.files["vocal"] ? req.files["vocal"][0].filename : raport.vocal;
        const videoFile = req.files["video"] ? req.files["video"][0].filename : raport.video;

        raport.description = req.body.description || raport.description;
        raport.image = imageFiles;
        raport.vocal = vocalFile;
        raport.video = videoFile;

        await raport.save();
        return res.status(200).json({status : httpStatusText.SUCCESS, message: "Raport updated successfully", data: raport });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

// Delete Raport
const deleteRaport = async (req, res) => {
    try {
        const raport = await Raport.findByIdAndDelete(req.params.id);
        if (!raport) return res.status(404).json({status : httpStatusText.FAIL, error: "Raport not found" });

        return res.status(200).json({status : httpStatusText.SUCCESS, message: "Raport deleted successfully" });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

const getRaportByUser = async (req, res) => {
    try {
        const { userid } = req.params;

        const raports = await emergencyModel.find({ user: userid , emergencyType : "raport" }).lean();
        if (!raports.length) {
            return res.status(404).json({status : httpStatusText.FAIL, message: "No Raports found for this user" });
        }
        return res.status(200).json({status : httpStatusText.SUCCESS, data: raports });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
}

module.exports = {
    createRaport,
    getAllRaports,
    getRaportById,
    updateRaport,
    deleteRaport,
    getRaportByUser
};
