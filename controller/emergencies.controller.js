const emergencyModel = require("../models/emergency.model");

const getAllEmergencies = async (req, res) => {
    try {
        const emergencies = await emergencyModel.find().lean();
        return res.status(200).json({status : httpStatusText.SUCCESS, data: emergencies });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error });
    }
};

module.exports = {
    getAllEmergencies,
};