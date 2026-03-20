import mongoose from 'mongoose';

let isConnected: number = 0;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  // FORZAMOS a que solo use la variable de entorno
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    throw new Error('CRITICAL: MONGODB_URI is not defined in Vercel Environment Variables');
  }

  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    const db = await mongoose.connect(mongoURI);
    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
