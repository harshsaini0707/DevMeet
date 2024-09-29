const express = require("express");
const app =  express();
const {connectDB}=require("../src/config/database")
const User = require("../models/user")

app.use(express.json());


app.post("/signup",async (req,res)=>{
 try{
    const body = req.body;
    const user = await User.create({
        firstName : body.firstName,
        lastName : body.lastName,
        email : body.email,
        password: body.password,
        age: body.age,
        gender : body.gender,
       
    })
    res.send(user);
 }
 catch(err){
    console.log(err);
    
 }
})

connectDB().then(()=>{
    console.log("DB Connected Successfully!!");
    
    app.listen(7777,()=>console.log("Server is Successfully Started!!"))
    
    }).catch((err)=>{
    console.log("DB Connection Error");
    
    })
