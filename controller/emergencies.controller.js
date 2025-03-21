const emergencyModel = require("../models/emergency.model");
const httpStatusText = require("../utils/httpStatusText");

const getAllEmergencies = async (req, res) => {
    try {
        const emergencies = await emergencyModel.find()
            .populate("fastcall")  
            .populate("msg")       
            .populate("report")    
            .populate("user", "fullName email") 
            .lean();  

        return res.status(200).json({ status: "SUCCESS", data: emergencies });
    } catch (error) {
        return res.status(500).json({ status: "ERROR", error: "Internal Server Error", details: error.message });
    }
};

// 🚔 Get Police Emergencies
const getAllPoliceEmergency = async (req, res) => {
    await getEmergenciesByNeed(req, res, "الشرطة");
};

// 🚓 Get Gendarmerie Emergencies (الدرك)
const getAllGendarmerieEmergency = async (req, res) => {
    await getEmergenciesByNeed(req, res, "الدرك");
};

// 🚑 Get Ambulance Emergencies (إسعاف)
const getAllAmbulanceEmergency = async (req, res) => {
    await getEmergenciesByNeed(req, res, ["اسعاف", "إسعاف"]);
};

// 🔍 Generic function to get emergencies based on "Needs"
const getEmergenciesByNeed = async (req, res, needType) => {
    try {
        const emergencies = await emergencyModel.find({ Needs: { $in: needType } })
            .populate("fastcall")
            .populate("msg")
            .populate("report")
            .populate("user", "fullName email")
            .lean();

        return res.status(200).json({ status: "SUCCESS", data: emergencies });
    } catch (error) {
        return res.status(500).json({ status: "ERROR", error: "Internal Server Error", details: error.message });
    }
};

const confirmeEmergency = async (req, res) => {
    try {
        const { emergencyId } = req.params;

        // Find the emergency by ID
        const emergency = await emergencyModel.findById(emergencyId);
        if (!emergency) {
            return res.status(404).json({ status: "FAIL", message: "Emergency not found" });
        }

        emergency.status = true;
        await emergency.save();

        return res.status(200).json({ 
            status: "SUCCESS", 
            message: "Emergency confirmed successfully", 
            data: emergency 
        });
    } catch (error) {
        return res.status(500).json({ status: "ERROR", error: "Internal Server Error", details: error.message });
    }
}

module.exports = {
    getAllEmergencies,
    getAllPoliceEmergency,       // 🚔 الشرطة
    getAllGendarmerieEmergency,  // 🚓 الدرك
    getAllAmbulanceEmergency,     // 🚑 إسعاف
    confirmeEmergency
};


