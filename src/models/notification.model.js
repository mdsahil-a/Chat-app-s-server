import mongoose from 'mongoose';

const notificationSchema=new mongoose.Schema({

userName:{
type:String
},
profilePic:{
    type:String
},
  
 recieverId:{
    type:String,
    required:true
 },
    message:{
        type:String
    }

},
{timestamps:true}
)

const Notification =mongoose.model("Notification",notificationSchema);

export default Notification;