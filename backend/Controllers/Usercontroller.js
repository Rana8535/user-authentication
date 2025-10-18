import usermodel from "../Models/Usermodel.js";

export const getuserdata=async (req,res)=>{
    try {
        const {userid}=req.body;
        const user=await usermodel.findById(userid);

        if(!user){
            return res.json({success:false,message:"user not found"});
        }
        res.json({success:true,
            userdata:{
                name:user.name,
                isaccountverified:user.isaccountverified,
            }
        });
    } catch (err) {
        res.json({success:false,message:err.message});
    }
}
