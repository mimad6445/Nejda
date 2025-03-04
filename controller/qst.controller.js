const Qstdb = require("../models/qst.model")
const httpStutsText = require("../utils/httpStatusText");


const createQst = async (req,res)=>{
    try{
        const { Qustions, type,enumReponse} = req.body;
        const newProduct = new Qstdb({Qustions, type,enumReponse});
        await newProduct.save()
        res.status(201).json({status : httpStutsText.SUCCESS,product : newProduct});
    }catch (error) {
        res.status(500).json({error: error});
}}

const deleteQst = async (req, res) => {
    try {
        const qstId = req.params.id;
        const qst = await Qstdb.findByIdAndDelete(qstId);
        if (!qst) {
            return res.status(404).json({ success: httpStutsText.FAIL, message: 'Qst not found' });
        }
        res.status(200).json({ success: httpStutsText.SUCCESS, message: 'qst deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: httpStutsText.FAIL, message: 'Internal server error' });
    }
};

const getAllQst = async (req, res) => {
    try {
        const qst = await Qstdb.find(); 
        res.status(200).json({ success: httpStutsText.SUCCESS, Qustions: qst }); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

const getOneQst = async (req, res) => {
    try {
        const qstId = req.params.id; 
        const qst = await Qstdb.findById(qstId); 
        if (!qst) {
            return res.status(404).json({success :httpStutsText.SUCCESS, message: 'qst not found' });
        }
        res.status(200).json({ success: httpStutsText.SUCCESS, Qustions: qst });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateQst = async (req, res) => {
    try {
        const qstId = req.params.id;
        const updates = req.body;
        const qst = await Qstdb.findByIdAndUpdate(qstId, updates, { new: true });
        if (!qst) {
            return res.status(404).json({ success: httpStutsText.FAIL, message: 'Qst not found' });
        }
        res.status(200).json({ success: httpStutsText.SUCCESS, message: 'Qst updated successfully', qst });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
        createQst,
        deleteQst,
        getAllQst,
        getOneQst,
        updateQst
    };