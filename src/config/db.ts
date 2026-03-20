import mongoose from 'mongoose';

/**
 * Global variable to cache the MongoDB connection state.
 * In serverless environments like Vercel, this prevents creating 
 * multiple connections on every request.
 */
let isConnected: number = 0;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const db = await mongoose.connect(mongoURI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // In serverless, we don't necessarily want to exit the process, 
    // but we throw the error so the request fails correctly.
    throw err;
  }
};
