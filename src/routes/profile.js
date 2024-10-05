const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../../middlewares/auth")
const  {validateEditUserData}  =  require("../../utils/validation")
const bcrypt  = require('bcrypt');
 
profileRouter.get("/profile/view",userAuth, async (req,res)=>{

    try{
        const user = req.user;
        res.send(user)
    }catch(err){
       res.send("ERROR " +err.message);
    }
    
 
 })

 profileRouter.patch("/profile/edit",userAuth , async (req,res)=>{
     try {
        if(!validateEditUserData(req)){
          return  res.status(400).send("Invalid Edit Request")
        }
        const loggedinUser = req.user;
        
        
        //Now Changing In DB
        Object.keys(req.body).every((key) =>{
            loggedinUser[key] =  req.body[key]
        })
        await loggedinUser.save();
        console.log(loggedinUser);
        

       return  res.json({loggedinUser})

     } catch (error) {
        res.send("ERROR :"+error.message);
     }
 })

 profileRouter.patch("/profile/password",userAuth ,  async (req , res) =>{
  
    try {
        const loggedinUser = req.user;

        const validPass = await loggedinUser.validatePassword(req.body.oldPassword);
        if(!validPass ) return res.json({status : "Wrong password!!"})
        else{
        const changedPassword =  req.body.newPassword;
        const hash =  await bcrypt.hash(changedPassword,10);
        loggedinUser.password = hash;
        await loggedinUser.save();
      
         return res.json({status : "Password changed successfully"})
        }
    } catch (error) {
        res.send("ERROR :"+error.message);
    }

 })


 module.exports = profileRouter;