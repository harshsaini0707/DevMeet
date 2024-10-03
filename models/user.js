const mongoose = require("mongoose");
const validator = require('validator');

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
    skills: {
        type: [String],
    },
    photoUrl: {
        type: String,
        validate(value) {  
            if (!validator.isURL(value)) {
                throw new Error(value + " is not a valid URL");
            }
        },
    },
    about: {
        type: String,
        default: "This is a default added by me",
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
