import Friend from '../models/friend.model.js';
import User from '../models/user.model.js';


export const searchUser=async(req,res)=>{  //this is to search users
const {name}=req.body;
try{
     const users=await User.find({
    fullName:{$regex:name,$options:"i"}
    }).select("-password");

    if(!users){
   return  res.status(404).json({message:"User not found"});
    }
 res.json(users);

}
catch(error){
    console.log("Error in searchUser :",error.message);
    res.status(500).json({message:"Internal server error"});
    
}
}

export const sendRequest=async(req,res)=>{ //this is to send friend request

const {userId,receiverId}=req.body;


try{


if(!userId || !receiverId){
    return  res.status(400).json({message:"Bad request"});
}

if(userId==receiverId){
    return res.status(400).json({message:"Cant add yourself"});

}



const alreadyFriend=await Friend.findOne({
    $or:[
        {sender:userId,receiver:receiverId,status:"added"},
        {sender:receiverId, receiver:userId,status:"added"}
    ]
});

if(alreadyFriend){
    return res.status(400).json({message:"Alreadyadded"});
}

const newRequest=new Friend({
    sender:userId,
    receiver:receiverId,
    status:"added"
});

newRequest.save();
return res.status(200).json({message:"User added successfully"});

}
catch(error){

    console.log("Error in send friend request :",error.message);
    return res.status(500).json({message:"Internal server error"});

}
}

export const getRequest=async(req,res)=>{
const {userId}=req.body;

try{

if(!userId){
    return res.status(400).json({message:"No user id found"});
}    

const friends=await Friend.find({
    $or:[
        {sender:userId,status:"pending"},
        {receiver:userId,status:"pending"}
    ]
});

if(!friends){
    return res.status(404).json({message:"No friend request"});
}

return res.status(200).json(friends);

}catch(error){


    console.log("Error in get request: ",error.message);
    return res.status(500).json({message:"Internal server error"});
}

}

export const acceptRequest=async(req,res)=>{ 

    const {userId,senderId}=req.body;

    try{
if(!userId || !senderId){
    return res.status(400).json({message:"User Id or sender Id not found"});
}

const findRequest=await Friend.find({
 sender:senderId,
 receiver:userId,
 status:"pending"
});

if(!findRequest){
return res.status(404).json({message:"Request not found"});
}
findRequest.status="accepted";
findRequest.save();



    }
    catch(error){
        console.log("Error in accept request :",error.message);
        return res.status(500).json({message:"Internal server error"});
    }


}

export const rejectRequest=async(req,res)=>{

    const {userId,senderId}=req.body;

    try{
if(!userId || !senderId){
    return res.status(400).json({message:"User Id or sender Id not found"});
}

const findRequest=await Friend.find({
 sender:senderId,
 receiver:userId,
 status:"pending"
});

if(!findRequest){
return res.status(404).json({message:"Request not found"});
}
findRequest.status="rejected";
findRequest.save();



    }
    catch(error){
        console.log("Error in accept request :",error.message);
        return res.status(500).json({message:"Internal server error"});
    }


}

export const getUsers=async (req,res)=>{
const {userId}=req.body

try{

    if(!userId){
        return res.status(400).json({message:"User id not found"});
    }

    const users=await Friend.find({
        $or:[
            {sender:userId,status:"added"},
            {receiver:userId,status:"added"},
        ]
    });



res.status(200).json(users);

}
catch(error){
console.log("Error in get Users,",error.message);
res.status(500).json({message:"Internal Sever error"});


}


}