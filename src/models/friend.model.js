import mongoose from 'mongoose';

const friendSchema=new mongoose.Schema({
    sender:{
    type:String,
    required:true
    },

    receiver:{
    type:String,
    required:true
    },

    status:{
    type:String,
    enum:["added","notadded","blocked"],
    default:"notadded"
    }


},

{timestamps:true});

const Friend=mongoose.model("Friend",friendSchema);
export default Friend;