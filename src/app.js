const express = require("express");
const app =  express();

app.use("/hello",(req,res)=>{
    res.send("HELLO HELLO !!!!!!")
})
app.use("/test",(req,res)=>{
    res.send("Testing....!!!")
})

app.listen(7777,()=>console.log("Server is Successfully Started!!"))