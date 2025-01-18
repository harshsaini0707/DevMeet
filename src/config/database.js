const mongoose = require("mongoose");

const connectDB = async ()=>{
    mongoose.connect(DB_CONNECTION)
} // return promise

module.exports = {connectDB}
