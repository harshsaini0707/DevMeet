const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async(req,res,next)=>{
  try {
     //Read the token from req cookies 
   const cookies = req.cookies; //give all the cookies
   const token  = cookies?.userToken;
   if(!token) return  res.send("Token is not valid")

   //validate the token 
   const decodedObj = await jwt.verify(token,"Dev@123Meet");

   //Find the user from token
    const{_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user) return  res.send("User Not Found");
    req.user = user; // attach user to req
    next();
    
  } catch (error) {
    res.send("ERROR :"+error.message)
  }
}; 



module.exports = { userAuth};