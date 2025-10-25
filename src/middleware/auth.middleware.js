import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';


export const protectRoute=async (req,res,next)=>{
    // const token1 = req.headers["authorization"];
    // const token=token1?token1:req.cookies.jwt; 
    const {token}=req.body;


    try{

       
        if(!token){
         
       return res.status(401).json({message:"Unothorized access"});
        }
        const isValid=jwt.verify(token,process.env.JWT_SECRET);

        if(!isValid){
        return res.status(401).json({message:"Unothorized access"});
         }
        const user=await User.findById(isValid.userId).select("-password");

    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    req.user=user;
    next();

}
    catch(error){
console.log("Error in auth middleware",error.message);
res.status(500).json({message:"Internal server error"});
    }


}


