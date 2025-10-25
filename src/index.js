import express from 'express';
import dotenv from 'dotenv';
import authRoute from './route/auth.route.js';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import friendRoute from './route/friend.route.js';
import messageRoute from './route/message.route.js';
import Message from './models/message.model.js';
import User from './models/user.model.js';


dotenv.config();

const portNum = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/friend',friendRoute);
app.use('/api/message',messageRoute);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow all for testing; restrict in production
    methods: ["GET", "POST"],
  },
});


const users={};
io.on('connection', (socket) => {


socket.on("join",async (userId)=>{
     users[userId] = socket.id;
       socket.userId = userId; 
  socket.join(userId);


       const user= await User.findByIdAndUpdate(userId, { isOnline: true },  { new: true } );
   

      
    io.emit("updateUserStatus", { userId, isOnline: true });
});


  socket.on('sendMessage',async(data) => {

   const {senderId,receiverId,msg}=data;
   const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
console.log(currentTime);
   const message=new Message({
    sender:senderId,receiver:receiverId,message:msg
   });

    
    await message.save();

        const receiverSocket = users[receiverId];
    const senderSocket = users[senderId];
    io.to(receiverSocket).emit("receiveMessage",message);
    io.to(senderSocket).emit("receiveMessage",message);
  });

  socket.on('disconnect', async() => {
  
  const userId = socket.userId;
 
  if(userId){
    const user=await User.findByIdAndUpdate(userId, { isOnline: false },   { new: true } );

      io.emit("updateUserStatus", { userId, isOnline: false });
      delete users[userId];
  }


  
  });
});


httpServer.listen(portNum, () => {
  console.log(`Server is running at: http://localhost:${portNum}`);
  connectDB();
});



