import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
// import Friend  from '../models/friend.model.js';
import Friend from '../models/friend.model.js';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import cloudinary from '../lib/cloudinary.js';

const generateToken=(userId,res)=>{
const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:"7d"
});

res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:false,
      sameSite: "lax"

});
return token;
}

export const signup=async (req,res)=>{
     const {fullName,email,password}=req.body;


try{
console.log(fullName);
    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }

    if(password.length<6){
        return res.status(400).json({message:"password must be at least 6 char long"});
    }
    const user=await User.findOne({email});
    if(user){
        return res.status(400).json({message:"User already exists"});

    }

    const salt=await bcrypt.genSalt(10);
const hashedPassword=await bcrypt.hash(password,salt);

    const jsUser=new User({

        fullName:fullName,
        email:email,
        password:hashedPassword,
        profilePic:""

    })

    if(jsUser){
        generateToken(jsUser._id,res);
        await jsUser.save();
        
        return res.status(201).json({message:"User created successfully"});


    }
    else {
        return res.status(400).json({message:"Something went wrong"});
    }

}

catch(error){
    console.log("Error in controller",error.message);
    res.status(500).json({message:"Internal server error"});

}

}

export const login= async (req,res)=>{
   const {fullName,email,password}=req.body
    try {

if(!email || !password){
    return res.status(400).json({message:"All fields are required"});
}

if(password.length<6){
    return res.status(400).json({message:"Password length must be at least 6 character"})
}

const currentUser=await User.findOne({email});

if(!currentUser){
    return res.status(401).json({message:"Incorrect email or password"});
}

const isSame=await bcrypt.compare(password,currentUser.password);

if(!isSame){
    return res.status(401).json({message:"Incorrect email or password"});
}
 const token=generateToken(currentUser._id,res);

    res.status(200).json({
        message:"Logined successfully",
        token,
        user:{id:currentUser._id,fullName:currentUser.fullName}
    
    })


   
}
catch(error){
    console.log("Error in login controller: ",error.message);
   res.status(500).json({message:"Internal server error"})
}
}

export const logout=(req,res)=>{

try{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out successfully"});
    
}
  catch(error){
    console.log("Error in logout controller: ",error.message);
    res.status(500).json({message:"Internal server error"});
  }
}

// export const updateProfile=async (req,res)=>{

// const profilePic=req.selectedFile;
//     console.log(profilePic)
 
// try{
// if(!profilePic){
//     return res.status(400).json({message:"Profile picture is required"});
// }
// const uploadProfilePic=await cloudinary.uploader.upload(profilePic);
// const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadProfilePic.secure_url},{new:true});
// res.status(200).json({message:"Updated successfully"},updatedUser);
// }
// catch(error){
//     console.log("Error in update profile controller: ",error.message);
//     res.status(500).json({message:"Internal server error"});
// }

// }

export const checkAuth=async (req,res)=>{
try{

// await Friend.deleteMany({})
return res.status(200).json(req.user);
}
catch(error){
console.log("Error in check auth controller: ",error.message);
res.status(500).json({message:"Internal server error"});
}
}

export const find=async (req,res)=>{
const {id}=req.body;
    try{
if(!id){
    return res.status(400);
}

const user=await User.findById(id).select("-password");
return res.status(200).json(user);



    }
catch(error){
    console.log("Error in find user ",error.message);
    return res.status(500).json({message:"Internal server error"});
}

}


export const updateProfile=async (req,res)=>{
    
    const fileBuffer = req.file.buffer.toString("base64");
    
    try{
  
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

if(!fileBuffer){
    return res.status(400).json({message:"Profile picture is required"});
}
   const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${fileBuffer}`,{

        folder:"profile_pics"
      }

    );
   const isValid=jwt.verify(token,process.env.JWT_SECRET);
const updateUser=await User.findByIdAndUpdate(isValid.userId,{profilePic:uploadResult.secure_url},{new:true});
return res.status(200).json({link:uploadResult.secure_url,success:true});
   
}
catch(error){

console.log("Error in upload profile: ",error.message);
  return res.status(500).json({ success: false, message: "Upload failed" });
}

}

export const sendNotification=async(req,res)=>{

    const {userId,recieverId,message}=req.body;
try{

    const user=await User.findById(userId);

    const notification=new Notification({
        userName:user.fullName,profilePic:user.profilePic,recieverId,message
    });

    notification.save();

    res.status(201).json({message:"Notification sent successfully"});


}
catch(error){
    console.log("Error in send notification :",error.message);
    res.status(500).json({message:"Internal server error"});
}


}

export const notification=async(req,res)=>{
const {userId}=req.body;
try{

const notifications=await Notification.find({
recieverId:userId
});

res.status(200).json(notifications);


}
catch(error){
    console.log("Error in Notification :",error.message);
    res.status(500).json({message:"Internal server error"});
}



}
export const deleteNotification=async (req,res)=>{
const {id}=req.body;
try{

    const data=await Notification.deleteOne({_id:id});

    res.status(200).json({message:"Deleted"})

}
catch(error){
    console.log("Error in delete notification",error.message);
    res.status(500).json({message:"Internal server error"});
}


}