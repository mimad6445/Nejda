const Msg = require("../models/msg.model");
const userdb = require("../models/user.model")
const httpStatusText = require("../utils/httpStatusText");
const emergencyModel = require("../models/emergency.model");
// Create Message
const createMsg = async (req, res) => {
    try {
        const io = req.app.get('socketio');
        const userid = req.params.userid;
            const user = await userdb.findById(userid);
                if(!user){
                    return res.status(404).json({ status: httpStatusText.FAIL, message: "user not exist" });
                }
        const { emergencyType, msg, injured, inTheSence , Needs } = req.body;

        // Validate required fields
        if (emergencyType === undefined ||injured === undefined || inTheSence === undefined || Needs === undefined) {
            return res.status(400).json({ status: httpStatusText.FAIL, error: "injured and inTheSence fields are required" });
        }

        const newMsg = new Msg({
            emergencyType,
            msg,
            injured,
            inTheSence,
            Needs
        });
        const newEmergency = new emergencyModel({
            emergencyType : "msg",
            report : newMsg._id,
            user : userid
        })
        user.emergencies.push(newEmergency._id);
        await user.save();
        await newEmergency.save();
        await newMsg.save();
        io.emit('newFact', newMsg);
        return res.status(201).json({status: httpStatusText.SUCCESS, message: "Message created successfully", data: newMsg });
    } catch (error) {
        return res.status(500).json({status: httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

// Get All Messages
const getAllMsgs = async (req, res) => {
    try {
        const msgs = await Msg.find().lean();
        return res.status(200).json({status: httpStatusText.SUCCESS, data: msgs });
    } catch (error) {
        return res.status(500).json({status: httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

// Get Single Message
const getMsgById = async (req, res) => {
    try {
        const msg = await Msg.findById(req.params.id);
        if (!msg) return res.status(404).json({status: httpStatusText.FAIL, error: "Message not found" });

        return res.status(200).json({status: httpStatusText.SUCCESS, data: msg });
    } catch (error) {
        return res.status(500).json({status: httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

// Update Message
const updateMsg = async (req, res) => {
    try {
        const { emergencyType, msg, injured, inTheSence } = req.body;

        const updatedMsg = await Msg.findByIdAndUpdate(
            req.params.id,
            { emergencyType, msg, injured, inTheSence },
            { new: true, runValidators: true }
        );

        if (!updatedMsg) return res.status(404).json({status: httpStatusText.FAIL, error: "Message not found" });

        return res.status(200).json({status: httpStatusText.SUCCESS, message: "Message updated successfully", data: updatedMsg });
    } catch (error) {
        return res.status(500).json({status: httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

// Delete Message
const deleteMsg = async (req, res) => {
    try {
        const msg = await Msg.findByIdAndDelete(req.params.id);
        if (!msg) return res.status(404).json({status: httpStatusText.FAIL, error: "Message not found" });

        return res.status(200).json({status: httpStatusText.SUCCESS, message: "Message deleted successfully" });
    } catch (error) {
        return res.status(500).json({status: httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

const getMsgByUser = async (req, res) => {
    try {
        const { userid } = req.params;

        const messages = await emergencyModel.find({ user: userid ,emergencyType : "msg" }).lean();

        if (!messages.length) {
            return res.status(404).json({status : httpStatusText.FAIL, message: "No messages found for this user" });
        }

        return res.status(200).json({status : httpStatusText.SUCCESS, data: messages });
    } catch (error) {
        return res.status(500).json({status : httpStatusText.ERROR, error: "Internal Server Error", details: error.message });
    }
};

module.exports = {
    createMsg,
    getAllMsgs,
    getMsgById,
    updateMsg,
    deleteMsg,
    getMsgByUser
};
