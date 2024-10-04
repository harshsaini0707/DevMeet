const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../../middlewares/auth")

requestRouter.post("/sendConnectionRequest",userAuth,(req,res)=>{

   console.log("Sending Connection Request");
   const user = req.user;


   return res.send(user.firstName+" is Sending a Connection Reques!!")
   
})

module.exports = requestRouter;