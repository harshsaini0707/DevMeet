const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../../middlewares/auth");
const ConnectionRequestModel = require("../../models/connectionRequest");
const User = require("../../models/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth, async (req,res)=>{

 try {
      const fromUserId =  req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;


      const allowedStatues = ["ignored" , "interested"];
      if(!allowedStatues.includes(status)){
         return res.status(400).json({message: " Invalid status type "+status})
      }
      
      const userId = await User.findById(toUserId);
      if(!userId){
         return res.status(400).json({message : "User not found!"})
      }

      //check if there is existing ConnectionRequest
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
         //OR conditon in mongoose
         $or:[
            {fromUserId ,  toUserId}, // {} || {}
            {fromUserId :  toUserId , toUserId :  fromUserId}
         ],
      })
      if(existingConnectionRequest){
         return res.status(400).json({
            message : "Connection Request Already Exists!!"
         })
      }
      const connectionRequest =  new ConnectionRequestModel({
         fromUserId,
         toUserId,
         status
      })
     const data =   await connectionRequest.save();
     return res.json({message : req.user.firstName+" is "+status+" in "+userId.firstName, data })


   


   } catch (error) {
      return res.send("ERROR: "+ error.message)
   }
   
})

module.exports = requestRouter;