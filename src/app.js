const express = require("express");
const app =  express();
const {connectDB}=require("../src/config/database")
const User = require("../models/user")
const{validateSignupData} = require("../utils/validation")
const bcrypt  = require('bcrypt');
const validator = require('validator');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const {userAuth} = require("../middlewares/auth")

app.use(express.json());
app.use(cookieParser());


app.post("/signup",async (req,res)=>{

 try{
   //Validation of data
   validateSignupData(req);
   //Encrypt the password -> Store
   const{firstName , lastName , email ,password} = req.body;
   const passwordHashed = await bcrypt.hash(password,10);
   console.log(passwordHashed);
   
   //Creating a instance of  User Model
   const user = new User({
      firstName,lastName,email,password : passwordHashed ,
   });

    await user.save();
    return res.json(user);
 }
 catch(error){
    res.send("ERROR " +error.message);
    
 }
})

app.post("/login", async (req,res)=>{
   try{

  const {email,password} = req.body;

  if(!validator.isEmail(email)){
   throw new Error("Email is not valid")
  }
   
   const user = await User.findOne({email:email});
   if(!user){
      res.send("Invalid Crendential!!")
   }
   
   //return boolean 
   const isValidPassword = await bcrypt.compare(password,user.password);
   if(isValidPassword){
       
      //Create a JWT token
       const token = await jwt.sign({_id:user.id},"Dev@123Meet",{expiresIn : "1d"});
       console.log(token);
       
      //Add the token to the cookie and send the response back to user
      res.cookie("userToken",token,{httpOnly : true});

      res.send("Login Successfull")
   }else{
      res.send("Invalid Crendential!!")
   }


  }catch(err){
   res.send("ERROR " +err.message);
   }

})

app.get("/profile",userAuth, async (req,res)=>{

   try{
       const user = req.user;
       res.send(user)
   }catch(err){
      res.send("ERROR " +err.message);
   }
   

})

app.post("/sendConnectionRequest",userAuth,(req,res)=>{

   console.log("Sending Connection Request");
   const user = req.user;


   return res.send(user.firstName+" is Sending a Connection Reques!!")
   
})





app.patch("/user/:userId",async (req,res)=>{


   const id = req.params?.userId;
   const data = req.body;
   
   try { 
      const ALLOWED_UPDATES = ["skills","age","gender","photoUrl","about"];
      
      const isUpdateAllowed = Object.keys(data).every((k)=>{
       return  ALLOWED_UPDATES.includes(k);
      })
      if(!isUpdateAllowed) res.status(400).send("Update Not Allowed");

      if(data?.skills.length > 10) res.status(400).send("Only 10 Skills you add");


      await User.findByIdAndUpdate({_id:id },data , {runValidators:true})
      res.json({upadate: "Sucessfully updated!!"})

   } catch (error) {
      res.send(error)
   }
})


connectDB().then(()=>{
    console.log("DB Connected Successfully!!");
    
    app.listen(7777,()=>console.log("Server is Successfully Started!!"))
    
    }).catch((err)=>{
    console.log("DB Connection Error");
    
    })
