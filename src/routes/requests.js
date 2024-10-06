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

requestRouter.post("/request/review/:status/:requestId" ,userAuth , async (req, res) =>{

try {
   const requestId =  req.params.requestId;
   const status =  req.params.status;
   const loggedInUser = req.user;
    
   const allowStatus  = ["accepted" , "rejected"];

   if(!allowStatus.includes(status) ){
      return res.status(400).json({message : "Invalid Status!!"})
   }

    const connectionRequest = await ConnectionRequestModel.findOne({
      _id : requestId, //not fromuser Id is id of Connection request
      toUserId : loggedInUser._id,
      status : "interested"
    });
    if(!connectionRequest){
      return res.status(404).json({message : "Connection request Is Not Found!!"})
    } 

    connectionRequest.status = status;
    const data  = await connectionRequest.save();
    return res.status(200).json({message : "Connection Request  is "+status , data})

} catch (error) {
   return res.send("ERROR: "+ error.message)}
})

module.exports = requestRouter;