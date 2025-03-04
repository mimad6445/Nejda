const admindb = require("../models/auth/admin.model");
const httpStatusText = require("../utils/httpStatusText")
const bcrypt = require("bcryptjs")

const createAdmin =  async(req,res,next)=>{
    try {
        const {name, email , password ,adminType ,phoneNumber} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const addNewAdmin = new admindb({name,email,password:hashedPassword,avatar:req.file.filename,adminType,phoneNumber});
        const token = await generateToken({ email:email,name,phoneNumber , id: addNewuser._id})
        addNewAdmin.token = token;
        await addNewAdmin.save();
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { addNewAdmin } });
    } catch (error) {
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' ,error});
    }
}

const login =  async(req,res,next)=>{
    try {
        const {email,password} = req.body;
        const admin = await admindb.findOne({email : email}).lean();
        if(!admin){
            res.status(404).json({ status: httpStatusText.FAIL, message: "email n'exist pas" });
        }
        const passwordCompare = await bcrypt.compare(password,admin.password);
        if(!passwordCompare){
            res.status(404).json({ status: httpStatusText.FAIL, message: "password" });
        }
        const token = await generateToken({email: email , id: user._id, role : "user"});
        await admindb.findByIdAndUpdate(admin._id, { token });
        res.status(200).json({status: httpStatusText.SUCCESS, data: {
            fullname : admin.fullname,
            email : email,
            avatar : admin.avatar,
            token : token
        }})
    } catch (error) {
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' ,error});
    }
}

const getAllAdmin =  async(req,res,next)=>{
    try {
        const admins = await admindb.find().lean(); 
        res.status(200).json({status: httpStatusText.SUCCESS, admins}); 
    } catch (error) {
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' ,error});
    }
}

const deleteAdmin =  async(req,res,next)=>{
    try {
        const adminId = req.params.id;
        const admin = await admindb.findById(adminId);
        if (!admin) {
            return res.status(404).json({ success: httpStatusText.FAIL, message: "admin n'exist pas" });
        }
        await admindb.findByIdAndDelete(adminId);
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' , error});
    }
}

const updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const updates = req.body;
        const admin = await admindb.findByIdAndUpdate(adminId, updates, { new: true });
        if (!admin) {
            return res.status(404).json({ success: httpStatusText.FAIL, message: 'Admin not found' });
        }
        res.status(200).json({ success: httpStatusText.SUCCESS, message: 'Admin updated successfully', data : {admin} });
    } catch (error) {
        res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
};


module.exports = {
    createAdmin,
    login,
    getAllAdmin,
    deleteAdmin,
    updateAdmin
};