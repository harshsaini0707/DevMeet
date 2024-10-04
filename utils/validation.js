var validator = require('validator');
const validateSignupData = (req)=>{

    const{firstName , lastName, email , password} = req.body;
    if(!firstName || !lastName) throw new Error("Enter the name");
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")
    }
    // else if(!validator.isStrongPassword(password)){
    //     throw new Error("Create a strong password")
    // }


   
};

module.exports = {validateSignupData ,}