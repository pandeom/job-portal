import mongooes from "mongoose";

const connectDB=async () =>{
    try{
        await mongooes.connect(process.env.MONGO_URI);
        console.log('MongoDB connected sucessfully');
    }catch(error){
   console.log(error);
    }
}
export default connectDB;