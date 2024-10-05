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
   
       await user.save();
       
       
       return res.json(user);
    }
    catch(error){
       res.send("ERROR " +error.message);
       
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
      return res.send("Invalid Crendential!!")
    }
    
    //return boolean 
    const isValidPassword = await user.validatePassword(password);
 
    if(isValidPassword){
       //Get token 
       const token = await user.getJWT();
        
       //Add the token to the cookie and send the response back to user
       res.cookie("userToken",token,{httpOnly : true});
 
       return res.send("Login Successfull")
    }else{
      return  res.send("Invalid Crendential!!")
    }
 
 
   }catch(err){
    return res.send("ERROR " +err.message);
    }
 
 })

 authRouter.post("/logout", async (req,res)=>{
    res.cookie("userToken ",null ,{
        expires : new Date(Date.now())
    })
    res.send("Logout Successfull!!");
 })

module.exports= authRouter;
