import mongoose from 'mongoose';
const userSchema=new mongoose.Schema(

{
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        required:true,
        unique:false,
        minlength:6,
        type:String
    },
    fullName:{
        type:String,
        required:true,
        unique:false

    },
    profilePic:{
        type:String,
        default:"",
    },
isOnline: { type: Boolean, default:false }
}

);
const User=mongoose.model("User",userSchema);

export default User;







