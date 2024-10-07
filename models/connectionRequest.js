const mongoose =  require("mongoose");


const connectionRequestSchema =  new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required :  true,
        ref : "User" // Ref to User Collectaction
    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required :  true,
        ref : "User" 
    },
    status:{
        type : String,
        required :  true,
        enum: {
            values : ["ignored" , "interested" , "accepted" , "rejected"],
            message : `{VALUE} is incorrect status type` // throw this if anobe values is not included
        }
    }

},{timestamps  : true})

connectionRequestSchema.index({toUserId : 1 , fromUserId :1}) // compund indexing

connectionRequestSchema.pre("save",function(next){
   
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot Send  Connection Request To Yourself!!");
    }
    next(); //Imp
})

const ConnectionRequestModel = new   mongoose.model("ConnectionRequestModel" , connectionRequestSchema)
module.exports = ConnectionRequestModel