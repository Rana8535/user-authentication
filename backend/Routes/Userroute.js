import express from "express";
import userauth from "../Middleware/Userauth.js";
import { getuserdata } from "../Controllers/Usercontroller.js";
const userrouter=express.Router();

userrouter.get('/data',userauth,getuserdata);

export default userrouter;