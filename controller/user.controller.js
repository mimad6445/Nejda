const userdb = require("../models/user.model")
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const httpStatusText = require("../utils/httpStatusText")
const Otp = require("../middlewares/vierfyOtp")
const { z } = require('zod')

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    fullName: z.string().min(3),
    phoneNumber: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
});


const registerUser = async(req,res)=>{
    try {
        const {email,password,fullName,phoneNumber} = req.body;

        const parsedData = userSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.errors });
        }

        if (!email ) {
            return res.status(400).json({ error: "Email is required!" });
        }

        const existingEmail = await userdb.findOne({ email: email }).lean();
        if (existingEmail) {
            return res.status(400).json({ status: "FAILED", msg: "E-mail already exists" });
        }    

        const hashedPassword = await bcrypt.hash(password,10);
        const addNewuser = new userdb({fullName,phoneNumber,email,password:hashedPassword,image: req.file ? req.file.filename : null,});
        
        // const token = await generateToken({ email:email,phoneNumber,fullName , id: addNewuser._id})
        // addNewuser.token = token;
        await addNewuser.save();
        
        res.status(201).json({ status: httpStatusText.SUCCESS, data: { addNewuser }});
    } catch (error) {
        console.log("error",error);
        res.status(500).json({status: httpStatusText.ERROR, message: 'Internal server error',error: error});
    }
}


const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required!" });
        }
        const user = await userdb.findOne({email : email}).lean();
        if(!user){
            res.status(404).json({ status: httpStatusText.FAIL, message: "email n'exist pas" });
        }
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            res.status(404).json({ status: httpStatusText.FAIL, message: "password not much" });
        }
        // const token = await generateToken({email: email , id: user._id, role : "user"});
        // await userdb.findByIdAndUpdate(user._id, { token });
        return res.status(200).json({status: httpStatusText.SUCCESS, msg : "user login success" , data: {id:user._id,email : email,fullName : user.fullName,phoneNumber : user.phoneNumber}});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: httpStatusText.ERROR, message: 'Internal server error',error: error});
    }
}

const deleteuser = async(req,res,next)=>{
    const userId = req.params.id;
    const user = await userdb.findById(userId);
    if (!user) {
        return res.status(404).json({ success: httpStatusText.FAIL, message: "user n'exist pas" });
    }
    await userdb.findByIdAndDelete(userId);
    return res.status(200).json({ success: httpStatusText.SUCCESS, message: 'user deleted successfully' });
}

const updateuser = async(req,res,next)=>{
    try {
        const userId = req.params.id;
        const updates = req.body;
        const user = await userdb.findByIdAndUpdate(userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ success: httpStatusText.FAIL, message: 'user not found' });
        }
        return res.status(200).json({ success: httpStatusText.SUCCESS, message: 'user updated successfully', data : {user} });
    } catch (error) {
        return res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
}

const otpLoginPhone = async(req,res,next)=>{
    Otp.createOtpPhone(req.body,(err,result)=>{
        if(err) return res.status(400).json({success : httpStatusText.ERROR , data : err })
        return res.status(200).json({success : httpStatusText.SUCCESS , data : result })
    })
}

const virefyOtpPhone = async(req,res,next)=>{
    Otp.virefyOtpPhone(req.body,(err,result)=>{
        if(err) return next(err)
        return res.status(200).json({success : httpStatusText.SUCCESS , data : result })
    })
}

const allUsers = async(req,res,next)=>{
    try {
        const users = await userdb.find().lean();
        returnres.status(200).json({ success: httpStatusText.SUCCESS, data: { users } });
    } catch (error) {
        return res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error' });
    }
}

const addImageToUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: httpStatusText.FAIL, message: 'Email is required' });
        }
        if (!req.file) {
            return res.status(400).json({ success: httpStatusText.FAIL, message: 'Image is required' });
        }
        const user = await userdb.findOneAndUpdate(
            { email: email },
            { image: req.file.filename },
            { new: true } // Returns the updated document
        );
        if (!user) {
            return res.status(404).json({ success: httpStatusText.FAIL, message: 'User not found' });
        }
        return res.status(200).json({ success: httpStatusText.SUCCESS, message: 'Image added successfully', user });
    } catch (error) {
        return res.status(500).json({ success: httpStatusText.ERROR, message: 'Internal server error', error });
    }
};



module.exports = {
    registerUser,
    login,
    deleteuser,
    updateuser,
    otpLoginPhone,
    virefyOtpPhone,
    allUsers,
    addImageToUser
}