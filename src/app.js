const express = require("express");
const app =  express();
const {adminAuth , userAuth} = require("../middlewares/auth");

app.use("/admin", adminAuth)

app.get("/user/login",(req,res)=>{
    res.send(("Loggeg In Successfullyy!!"))
})

app.get("/user",userAuth,(req,res)=>{
    res.send("User Getted!!")
})

app.get("/admin/getAllData",(req,res)=>{
    //logic
    res.send("All Data Sent")
})

app.get("/admin/delete",(req,res)=>{
res.send("User Deleted")
})

app.listen(7777,()=>console.log("Server is Successfully Started!!"))