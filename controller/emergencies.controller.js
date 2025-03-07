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


module.exports = {
    getAllEmergencies,
};