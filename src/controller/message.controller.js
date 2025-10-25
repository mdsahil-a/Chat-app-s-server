import User from '../models/user.model.js';
import Friend from '../models/friend.model.js';
import Message from '../models/message.model.js';


export const sendMessage=async(req,res)=>{
const {senderId,receiverId,message}=req.body;

try{
if(!senderId || !receiverId){
    return res.status(400).json({message:"User id or sender id not found"});
}

const  message=new Message({
    sender:senderId,
    receiver:receiverId,
    message
});
message.save();
res.status(200).json(message);


}
catch(error){
    console.log("Error in send message :",error.message);
    return res.status(500).json({message:"Internal server error"});
}
}

export const receiveMessage=async(req,res)=>{
const {userId,receiverId}=req.body;


try{
    if(!userId || !receiverId){
return res.status(400).json({message:"Id is missing"});
    }

    const messages=await Message.find({
        $or:[
            {sender:userId,receiver:receiverId},
            {sender:receiverId,receiver:userId}
        ]
    }).sort({createAt:1});

    

}
catch(error){

    console.log("Error in receive message :",error.message);
    return res.status(500).json({message:"Internal server error"});
}

}

export const loadMessage=async (req,res)=>{
    const {userId,id}=req.body;


    try{

        const datas=await Message.find({
            $or:[
                {sender:userId,receiver:id},
                {sender:id,receiver:userId}
            ]
        });

        res.status(200).json(datas);


    }
    catch(error){
        console.log("Error in message controller: ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}