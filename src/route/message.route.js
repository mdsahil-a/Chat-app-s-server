import Message from '../models/message.model.js';
import express from 'express';
import { loadMessage } from '../controller/message.controller.js';

 const messageRoute=express.Router();

messageRoute.post("/loadMessage",loadMessage);

 export default messageRoute;

 