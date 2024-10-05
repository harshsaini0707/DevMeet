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
const validateEditUserData = (req) =>{

  const allowedEditFields = ["firstName" , "lastName" , "photoUrl" , "skills" , "about" , "gender" , "age"];
  
 const isEditAllowed = Object.keys(req.body).every((k) =>{
    return allowedEditFields.includes(k);
  })

  return isEditAllowed;

}


module.exports = {validateSignupData , validateEditUserData }