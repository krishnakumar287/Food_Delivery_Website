import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://krishnakumarkd2005:shanmugam.C2005@cluster0.lwxqel8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
       console.log('DB connected') ;
    })
}