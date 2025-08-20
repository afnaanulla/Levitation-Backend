import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (typeof mongoUri !== 'string' || mongoUri.trim().length === 0) {
      console.error('MONGO_URI is not defined. Set it in your environment or .env file.');
      process.exit(1);
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error', error);
    }
    process.exit(1);
  }
};

export default connectDB;