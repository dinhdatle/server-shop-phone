import dotenv from 'dotenv';
import mongoose from 'mongoose';

const connectDatabase = async() =>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true, useUnifiedTopology: true
        })
        console.log("Mogo Connected")
   
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)

    }

}

export default connectDatabase;