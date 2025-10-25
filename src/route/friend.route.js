import Friend from '../models/friend.model.js';
import express from 'express';
import { sendRequest,getRequest,acceptRequest,rejectRequest,searchUser,getUsers} from '../controller/friend.controller.js';

const friendRoute=express.Router();

friendRoute.post("/getUsers",getUsers);
friendRoute.post("/send",sendRequest);
friendRoute.post("/getRequest",getRequest);
friendRoute.post("/accept",acceptRequest);
friendRoute.post("/reject",rejectRequest);

friendRoute.post("/search",searchUser);
// friendRoute.post("/getFriendList",getFriendList);

export default friendRoute;