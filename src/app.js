const express = require("express");
const app =  express();
require("dotenv").config();

const {connectDB}=require("../src/config/database")

const cookieParser = require("cookie-parser")
const cors = require("cors")




app.use(cors({ //white labeling
    origin:"http://localhost:5173" ,// where is our frontend is hosted
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const exp = require("constants");
const { initialiseSocket } = require("./routes/socket.io");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/" ,userRouter);


// app.patch("/user/:userId",async (req,res)=>{


//    const id = req.params?.userId;
//    const data = req.body;
   
//    try { 
//       const ALLOWED_UPDATES = ["skills","age","gender","photoUrl","about"];
      
//       const isUpdateAllowed = Object.keys(data).every((k)=>{
//        return  ALLOWED_UPDATES.includes(k);
//       })
//       if(!isUpdateAllowed) res.status(400).send("Update Not Allowed");

//       if(data?.skills.length > 10) res.status(400).send("Only 10 Skills you add");


//       await User.findByIdAndUpdate({_id:id },data , {runValidators:true})
//       res.json({upadate: "Sucessfully updated!!"})

//    } catch (error) {
//       res.send(error)
//    }
// })

const http = require("http");
const server = http.createServer(app);
initialiseSocket(server)


connectDB().then(()=>{
    console.log("DB Connected Successfully!!");
    
    server.listen(process.env.PORT,()=>console.log("Server is Successfully Started!!"))
    
    }).catch((err)=>{
    console.log("DB Connection Error");
    
    })
