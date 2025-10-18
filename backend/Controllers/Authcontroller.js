import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import usermodel from "../Models/Usermodel.js";
import transporter from "../Config/Nodemailer.js";
import {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE} from '../Config/emailTemplates.js';
const SENDER_EMAIL=process.env.SENDER_EMAIL || 'ankur8535063065@gmail.com';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_text';
const NODE_ENV = process.env.NODE_ENV || 'development';
//register function
export const register=async(req,res)=>{
    const {name,email,password}=req.body;
    if(!name || !email || !password){
        return res.json({success:false,message:'missing details...'});
    }
    try{
        const existinguser=await usermodel.findOne({email});
        if(existinguser){
            return res.json({success:false ,message: "user already exists"});
        }
        const hasedpassword=await bcrypt.hash(password,10);
        const user=new usermodel({name,email,password: hasedpassword});
        await user.save();
        // const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token, {
            httpOnly:true,
            // secure:process.env.NODE_ENV==='production',
            // sameSite:process.env.NODE_ENV === 'production'?
            secure:NODE_ENV==='production',
            sameSite:NODE_ENV === 'production'?
            'none':'strict',
            maxAge: 7*24*60*60*1000
        })
        //SENDING WELCOME EMAIL
        const mailOptions={
            from:SENDER_EMAIL,
            to: email,
            subject: "Welcome to Authentication",
            text:`welcome authentication your account is created on email ${email}`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success: true});
    }
    catch(err){
        res.json({success:false ,message:err.message});
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({success:false ,message:"email and password required"});
    }
    try{
        const user=await usermodel.findOne({email});
        if(!user){
           return res.json({success:false ,message:"wrong e-mail"}); 
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.json({success:false ,message:"wrong password"});
        }

        const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token, {
            httpOnly:true,
            // secure:process.env.NODE_ENV==='production',
            // sameSite:process.env.NODE_ENV === 'production'?
            secure:NODE_ENV==='production',
            sameSite:NODE_ENV === 'production'?
            'none':'strict',
            maxAge: 7*24*60*60*1000
        })
        return res.json({success:true})

    }
    catch(err){
        return res.json({success:false ,message:err.message});
    }
}

export const logout=async (req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            // secure:process.env.NODE_ENV==='production',
            // sameSite:process.env.NODE_ENV === 'production'?
            secure:NODE_ENV==='production',
            sameSite:NODE_ENV === 'production'?
            'none':'strict',  
        })
        return res.json({success:true,message :"Logged out"});
    }
    catch(err){
        return res.json({success:false,message :err.message});
    }
}

export const sendverifyotp= async (req,res)=>{
    try{
        const {userid} =req.body;
        const user =await usermodel.findById(userid);
        if(user.isaccountverified){
            return res.json({success:false ,message:"Account already verified"});
        }
        //generating a six digit random number
        const otp=String(Math.floor(100000+Math.random()*900000));
        user.verifyotp=otp;
        user.verifyotpexpireat=Date.now()+24*60*60*1000;
        await user.save();

        const mailOptions={
            from:SENDER_EMAIL,
            to: user.email,
            subject: "Verification OTP",
            // text:`Your account verification otp is: ${otp}`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transporter.sendMail(mailOptions);
        res.json({success:true,message:'verification otp sent on mail'});
    }
    catch(err){
        res.json({success:false,message:err.message});
    }
}

export const verifyemail=async(req,res)=>{
    const {userid,otp}=req.body;
    if(!userid || !otp){
        return res.json({success:false ,message:"missing details"});
    }
    try{
        const user=await usermodel.findById(userid);
        if(!user){
           return res.json({success:false ,message:"user not found"});
        }

        if(user.isaccountverified){
            return res.json({success:false ,message:"Account already verified"});
        }

        if(user.verifyotp ==="" || user.verifyotp !== otp){
           return res.json({success:false ,message:"invalid otp"});
        }

        if(user.verifyotpexpireat <Date.now()){
            return res.json({success:false ,message:"otp expired"});
        }
        user.isaccountverified=true;
        user.verifyotp='';
        user.verifyotpexpireat=0;
        await user.save();
        return res.json({success:true,message:'email verified successfully'});
    }
    catch(err){
        return res.json({success:false ,message:err.message});
    }
}

export const isauthenticated=async (req,res)=>{
    try{
        return res.json({success:true});
    }
    catch(err){
        return res.json({success:false ,message:err.message});
    }
}

//send password reset otp

export const sendresetotp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false, message:"email is required"});
    }
    try{
        const user=await usermodel.findOne({email});
        if(!user){
            return res.json({success:false ,message:"user not found"});
        }

        //generating a six digit random number
        const otp=String(Math.floor(100000+Math.random()*900000));
        user.resetotp=otp;
        user.resetotpexpireat=Date.now()+15*60*1000;
        await user.save();

        const mailOptions={
            from:SENDER_EMAIL,
            to: user.email,
            subject: "password reset OTP",
            // text:`password reset otp is: ${otp}`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        };
        await transporter.sendMail(mailOptions);
        res.json({success:true,message:'reset otp sent on mail'});

    }catch(err){
        return res.json({success:false ,message:err.message});
    }
}

//reset user password
export const resetpassword=async (req,res)=>{
    const {email,otp,newpassword}=req.body;
    if(!email || !otp || !newpassword){
        return res.json({success:false ,message:"Email, Otp and new password is required"});
    }
    try{
        const user=await usermodel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user not found"});
        }
        if(user.resetotp ==="" || user.resetotp !== otp){
            return res.json({success:false,message:"invalid otp"});
        }
        if(user.resetotpexpireat<Date.now()){
            return res.json({success:false,message:"otp expired"});
        }

        const hashedpassword=await bcrypt.hash(newpassword,10);
        user.password=hashedpassword;
        user.resetotp="";
        user.resetotpexpireat=0;
        await user.save();

        return res.json({success:true,message:"password reset successfully"});

    }catch(err){
       return res.json({success:false ,message:err.message}); 
    }
}