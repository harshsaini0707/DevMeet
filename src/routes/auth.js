const express = require("express");
const authRouter = express.Router();
const{validateSignupData} = require("../../utils/validation")
const bcrypt  = require('bcrypt');
const validator = require('validator');
const User = require("../../models/user")


authRouter.post("/signup",async (req,res)=>{

    try{
      //Validation of data
      validateSignupData(req);
      //Encrypt the password -> Store
      const{firstName , lastName , email ,password , skills , age ,gender , about} = req.body;
     
      const passwordHashed = await bcrypt.hash(password,10);
      console.log(passwordHashed);
      
      //Creating a instance of  User Model
      const user = new User({
         firstName,lastName,email,age,gender ,about ,  skills , password : passwordHashed ,
      });
   
       const savedUser =await user.save();

       const token = await savedUser.getJWT();
        
       //Add the token to the cookie and send the response back to user
       res.cookie("userToken",token,{httpOnly : true});
 
       
       
       
       return res.json({message:"User Added Successfully" , data : savedUser});
    } 
    catch(error){
       res.status(401).send("ERROR " +error.message);
       
    }
   })

authRouter.post("/login", async (req,res)=>{
    try{
 
   const {email,password} = req.body;
 
   if(!validator.isEmail(email)){
    throw new Error("Email is not valid")
   }
    
    const user = await User.findOne({email:email});
    if(!user){
      return res.status(401).send("Invalid Crendential!!")
    }
    
    //return boolean 
    const isValidPassword = await user.validatePassword(password);
 
    if(isValidPassword){
       //Get token 
       const token = await user.getJWT();
        
       //Add the token to the cookie and send the response back to user
       res.cookie("userToken",token,{httpOnly : true});
 
       return res.send(user)
    }else{
      return  res.status(401).send("Invalid Password!!")
    }
 
 
   }catch(err){
    return res.status(401).send(err.message);
    }
 
 })

 authRouter.post("/logout", async (req,res)=>{
    res.cookie("userToken ",null ,{
        expires : new Date(Date.now())
    })
    res.send("Logout Successfull!!");
 })

module.exports= authRouter;
