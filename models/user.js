const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt  = require('bcrypt');
const jwt = require("jsonwebtoken");    

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim:true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        trim:true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) { 
            if (!validator.isEmail(value)) {
                throw new Error(value + " is not a valid Email");
            }
        },
    },
    password: {
        type: String,
        required: true,
        // validate(value) {  
        //     if (!validator.isStrongPassword(value)) {
        //         throw new Error(value + " is not a strong password");
        //     }
        // },
    },
    age: {
        type: Number,
       
        min: 18,
        max: 80,
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error(value + " is not an allowed gender");
            }
        },
    },
    photoUrl: {
        type: String,
        validate(value) {  
            if (!validator.isURL(value)) {
                throw new Error(value + " is not a valid URL");
            }
        },
    },
    skills: {
        type: [String],
        default : []
    },
    about: {
        type: String,
        default: "This is a default added by me",
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
     const user = this;
      //Create a JWT token
      const token = await jwt.sign({_id:user.id},"Dev@123Meet",{expiresIn : "1d"});
      console.log(token);

      return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;
}



const User = mongoose.model("User", userSchema);
module.exports = User;
