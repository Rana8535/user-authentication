import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_text';
const userauth= (req,res,next)=>{
    const {token} =req.cookies;
    if(!token){
        return res.json({success:false,message:"Not Authorized login again"});
    }
    try{
        const tokenDecode=jwt.verify(token,JWT_SECRET);
        if(tokenDecode.id){
            if (!req.body) req.body = {};
            req.body.userid=tokenDecode.id;
            return next();
        }
        else{
            return res.json({success:false,message:"Not Authorized login again"});
        }

    }
    catch(err){
        return res.json({success:false,message:err.message});
    }
}

export default userauth;
