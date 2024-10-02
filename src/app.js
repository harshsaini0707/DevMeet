const express = require("express");
const app =  express();
const {connectDB}=require("../src/config/database")
const User = require("../models/user")
const{validateSignupData} = require("../utils/validation")
const bcrypt  = require('bcrypt');
const validator = require('validator');

app.use(express.json());


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
      res.send("Login Successfull")
   }else{
      res.send("Invalid Crendential!!")
   }


  }catch(err){
   res.send("ERROR " +err.message);
   }

})

app.get("/user",async(req,res)=>{
   const userEmail = req.body.email;
  
   try {

   const feed =  await User.find({email : userEmail});

   if(!feed.length){
     res.status(404).json({status:"Error Email not found"})
   }else  return res.json(feed);

   } catch (err) {
      res.send(err);
   }
   
  })


app.get("/feed",async(req,res)=>{
 
 try {
   const feed = await User.find({});
    res.json({feed});
 } catch (err) {
   res.send(err);
 }
})
app.delete("/user",async (req,res)=>{
   const id = req.body._id;
   try {
   
   const user = await User.findByIdAndDelete(id);
   res.send({status :"Successfully User Deleted!!"})
   } catch (error) {
      res.send(error);
   }
   
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
