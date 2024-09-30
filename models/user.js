const mongoose = require("mongoose");

const userSchema  = new mongoose.Schema({
    firstName:{
        type : String,
        required : true,
        
    },
    lastName:{
        type : String,
        required : true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type: String,
        required : true,
        unique: true,
        trim:true,
    },
    password:{
        type : String,
        required : true,
    },
    age:{
        type : Number,
        required : true,
        min:18,
        max:80,
    
    },
    gender:{
        type : String,
        lowercase: true,
        validate(value){
            if(!["male","female","others"].includes(value))  throw new Error("This Gender is not allowed") 
        },
    },
    skills:{
        type : [String],

    },
    photoUrl:{
        type:String,
    },
    about:{
        type:String,
        default:"This is a default added by me"
    }
}, {timestamps : true})

const User = mongoose.model("User",userSchema);
module.exports = User;