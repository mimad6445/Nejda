const jwt = require("jsonwebtoken");

module.exports = async (playlode)=>{
    
    const token = jwt.sign(
                            playlode,
                            process.env.JWT_SECRET_KEY,
                            {expiresIn : '14d'}
                            );
    return token;
} 