const express = require("express");
const { userAuth } = require("../../middlewares/auth");
const ConnectionRequestModel = require("../../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/user/request/recevied" , userAuth, async (req,res)=>{
    //Get all the pending connection request for loggedIn User
  try {
    const loggedInUser = req.user;

    const connectionRequest =  await ConnectionRequestModel.find({
        toUserId : loggedInUser._id,
        status : "interested"

    }).populate("fromUserId" , ["firstName" , "lastName" , "photourl" , "skills", "age"])

        return res.status(200).json({
            message : "Data fetch sucessfully",
            data : connectionRequest
        })
    } catch (error) {
        return res.status(400).send("ERROR "+ error.message)
    }
})

userRouter.get("/user/connections" ,userAuth , async (req,res) =>{
    try {

    const loggedInUser =  req.user;

    const connectionRequest =  await ConnectionRequestModel.find({
        $or:[
            {toUserId : loggedInUser._id , status : "accepted"},
            {fromUserId : loggedInUser._id , status : "accepted"},

        ],
    }).populate("fromUserId" , "firstName lastName photoUrl age skills ")

    return res.json({data : connectionRequest})
    } catch (error) {
        return res.status(404).send("ERROR "+ error.message)
    }
})

module.exports = userRouter;