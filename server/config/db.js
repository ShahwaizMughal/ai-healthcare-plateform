import mongoose from 'mongoose';

// Connect to MongoDB Atlas or local MongoDB instance
const connectDB = async () => {
    try {
        const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-healthcare';
        const conn = await mongoose.connect(connStr);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
