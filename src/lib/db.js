import mongoose from 'mongoose';

 const connectDB=async()=>{
try{
    const con=await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully: "+con.connection.host);
}

catch(error){
    console.log("Cannot connect to database: ",error.message);
}

 }
export default connectDB;
