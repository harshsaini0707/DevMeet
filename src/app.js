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

app.patch("/edit",async (req,res)=>{
   const id = req.body._id;
   try {
      await User.findByIdAndUpdate({_id:id }, {firstName : "Java"})
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
