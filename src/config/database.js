const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async ()=>{
    mongoose.connect(process.env.DB_CONNECTION)
} // return promise

module.exports = {connectDB}
