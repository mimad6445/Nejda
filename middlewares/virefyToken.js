const jwt = require("jsonwebtoken");
const httpStutsText = require("../utils/httpStatusText");
require("dotenv").config();

module.exports = async(req,res,next)=>{
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    if(!authHeader){
        res.status(401).json({status: httpStutsText.UNAUTHORIZED, msg: "token require"})
    }
    try{
        const token = authHeader.split(' ')[1];
        const currentuser = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(currentuser);
        req.currentuser = currentuser
        next();
    }catch{
        res.status(403).json({ status: httpStutsText.FORBIDDEN });
    } 
}