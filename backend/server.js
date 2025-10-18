import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser"; 
import authRouter from './Routes/Authroute.js';
import connectdb from "./Config/Db.js";
import userRouter from "./Routes/Userroute.js";
const app=express();
const port=4000;
connectdb();

const allowedorigins=['http://localhost:5173'];
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedorigins, credentials:true}));

//api endpoint
// app.get('/',(req,res)=>{
//     res.send("api working");
// });

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);

app.listen(port,()=>{
    console.log(`server started on port: ${port}`)
});
