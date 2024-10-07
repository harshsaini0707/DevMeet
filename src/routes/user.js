const express = require("express");
const { userAuth } = require("../../middlewares/auth");
const ConnectionRequestModel = require("../../models/connectionRequest");
const User = require("../../models/user");
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
    }).populate("fromUserId" , "firstName lastName photoUrl age skills ").populate("toUserId" , "firstName lastName photoUrl age skills " );
    const data = connectionRequest.map((row) => {

        if(row.fromUserId._id.toString() === loggedInUser._id){
            return row.toUserId;
        }else return row.fromUserId;
    })

    return res.json({data})
    } catch (error) {
        return res.status(404).send("ERROR "+ error.message)
    }
})

userRouter.get("/feed" , async (req,res) =>{
    try {
        const loggedInUser =  req.user;

        //Find all connection that i have send or recevied
        const connectionRequest =  await ConnectionRequestModel.find({
            $or :[
                {fromUserId : loggedInUser._id },
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId  toUserId").populate("fromUserId", "firstName").populate("toUserId","firstName")
       
        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
         hideUserFromFeed.add(req.fromUserId.toString())
         hideUserFromFeed.add(req.toUserId.toString())
        });

        const users = await User.find({
            $and:[
                {_id : {$nin : Array.from(hideUserFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(["firstName" , "lastName" , "photourl" , "skills", "age"])
        res.send(users)
  
    } catch (error) {
         return res.status(404).send("ERROR "+ error.message)
    }
})

module.exports = userRouter;