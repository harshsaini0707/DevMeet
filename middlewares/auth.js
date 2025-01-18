const jwt = require("jsonwebtoken");
const User = require("../models/user")
require("dotenv").config();

const userAuth = async(req,res,next)=>{
  try {
     //Read the token from req cookies 
   const cookies = req.cookies; //give all the cookies
   const token  = cookies?.userToken;
  
   if(!token){ 
    // return  res.send("Token is not valid")
    return res.status(401).send("Please Login!");
}
   //validate the token 
   const decodedObj = await jwt.verify(token,process.env. JWT_SECRET_KEY);

   //Find the user from token
    const{_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user) return  res.send("User Not Found");
    req.user = user; // attach user to req
    next();
    
  } catch (error) {
    return res.send("ERROR :"+error.message)
  }
}; 



module.exports = { userAuth};