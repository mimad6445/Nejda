const Raport = require("../models/raport");

// Create Raport
const createRaport = async (req, res) => {
    try {
        const imageFiles = req.files["image"] ? req.files["image"].map(file => file.filename) : [];
        const vocalFile = req.files["vocal"] ? req.files["vocal"][0].filename : "";
        const videoFile = req.files["video"] ? req.files["video"][0].filename : "";

        const newRaport = new Raport({
            description: req.body.description,
            image: imageFiles,
            vocal: vocalFile,
            video: videoFile
        });

        await newRaport.save();
        res.status(201).json({ message: "Raport created successfully", data: newRaport });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
};

// Get All Raports
const getAllRaports = async (req, res) => {
    try {
        const raports = await Raport.find().sort({ createdAt: -1 });
        res.status(200).json({ data: raports });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
};

// Get Single Raport
const getRaportById = async (req, res) => {
    try {
        const raport = await Raport.findById(req.params.id);
        if (!raport) return res.status(404).json({ error: "Raport not found" });

        res.status(200).json({ data: raport });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
};

// Update Raport
const updateRaport = async (req, res) => {
    try {
        const raport = await Raport.findById(req.params.id);
        if (!raport) return res.status(404).json({ error: "Raport not found" });

        const imageFiles = req.files["image"] ? req.files["image"].map(file => file.filename) : raport.image;
        const vocalFile = req.files["vocal"] ? req.files["vocal"][0].filename : raport.vocal;
        const videoFile = req.files["video"] ? req.files["video"][0].filename : raport.video;

        raport.description = req.body.description || raport.description;
        raport.image = imageFiles;
        raport.vocal = vocalFile;
        raport.video = videoFile;

        await raport.save();
        res.status(200).json({ message: "Raport updated successfully", data: raport });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
};

// Delete Raport
const deleteRaport = async (req, res) => {
    try {
        const raport = await Raport.findByIdAndDelete(req.params.id);
        if (!raport) return res.status(404).json({ error: "Raport not found" });

        res.status(200).json({ message: "Raport deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error });
    }
};

module.exports = {
    createRaport,
    getAllRaports,
    getRaportById,
    updateRaport,
    deleteRaport
};
