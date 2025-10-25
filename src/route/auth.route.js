import express from 'express';
// import User from '../models/user.model.js';
import {login, signup, logout,checkAuth,find,updateProfile,notification, sendNotification,deleteNotification} from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({storage});
const authRoute=express.Router();

authRoute.post("/login",login);

authRoute.post("/signup",signup);

authRoute.post("/logout",logout);

authRoute.post("/checkAuth",protectRoute,checkAuth);
authRoute.post("/loadNotification",notification);
authRoute.post("/sendNotification",sendNotification);
authRoute.post("/find",find);
 authRoute.post("/profile-update",upload.single("image"),updateProfile);
authRoute.post("/deleteNotification",deleteNotification);


export default authRoute;

