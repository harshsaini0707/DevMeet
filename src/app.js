const express = require("express");
const app =  express();
const {connectDB}=require("../src/config/database")
const User = require("../models/user")

app.use(express.json());


app.post("/signup",async (req,res)=>{
   const body = req.body;
    //Creating a instance of  User Model
    const user = new User(body);
 try{
    await user.save();
    return res.json(user);
 }
 catch(err){
    res.send(err);
    
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
