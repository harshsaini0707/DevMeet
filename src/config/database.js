const mongoose = require("mongoose");

const connectDB = async ()=>{
    mongoose.connect("mongodb+srv://HarshSaini:Ev2NbFd4o5CRPcVS@namaste.oyshp.mongodb.net/DevMeet")
} // return promise

module.exports = {connectDB}
