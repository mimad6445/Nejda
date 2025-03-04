const Otpgenerator = require("otp-generator")
const crypto = require('node:crypto')
require("dotenv").config()
const sendSMS = require("../utils/SendSMS");

async function createOtpPhone(params,callback){
    const otp = Otpgenerator.generate(4,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false,
    })
    const ttl = 5 * 60 * 1000
    const expiers = Date.now() + ttl ;
    const data = `${params.phoneNumber}.${otp}.${expiers}`
    const hash = crypto.createHmac("sha256",process.env.OtpKey).update(data).digest('hex')
    const fullHash = `${hash}.${expiers}`
    console.log("your OTP is : ",otp);
    // Send Sms 
    // sendSMS(otp,params.phoneNumber);
    return callback(null,fullHash)
}

async function virefyOtpPhone(params,callback){
    let [hashValue , expiers ]= params.hash.split('.');
    const now = Date.now();
    if(now>parseInt(expiers)) return callback(null,"OTP expierd")
    const data = `${params.phoneNumber}.${params.otp}.${expiers}`;
    const newhash = crypto.createHmac("sha256",process.env.OtpKey).update(data).digest('hex')
    if(newhash ===hashValue){
        return callback(null,"Success")
    }
    else {
        return callback(null,"Invalid OTP")
    }
}

module.exports = {
    createOtpPhone,
    virefyOtpPhone,
}