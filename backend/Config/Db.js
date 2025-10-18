import mongoose from 'mongoose';

const connectdb=async()=>{
    const Url = process.env.MONGO_URI || "mongodb+srv://Ankur321:ankur123@cluster0.auigiqt.mongodb.net/auth-db?retryWrites=true&w=majority&appName=Cluster0";
    mongoose.connection.on('connected',()=>console.log("data base connected"));
    await mongoose.connect(`${Url}`);
}
export default connectdb;
