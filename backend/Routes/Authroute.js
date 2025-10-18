import express from 'express';
import { isauthenticated, login, logout, register, resetpassword, sendresetotp, sendverifyotp, verifyemail } from '../Controllers/Authcontroller.js';
import userauth from '../Middleware/Userauth.js';

const authrouter=express.Router();

authrouter.post('/register',register);
authrouter.post('/login',login);
authrouter.post('/logout',logout);
authrouter.post('/sendverifyotp',userauth,sendverifyotp);
authrouter.post('/verifyaccount',userauth,verifyemail);
authrouter.get('/isauthenticated',userauth,isauthenticated);
authrouter.post('/sendresetotp',sendresetotp);
authrouter.post('/resetpassword',resetpassword);


export default authrouter;
