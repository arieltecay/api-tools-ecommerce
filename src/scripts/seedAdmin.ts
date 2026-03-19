import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import AdminUser from '../models/admin-user.model';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tools_store';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding');

    const adminEmail = 'admin@tools-store.com';
    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      const passwordHash = await bcrypt.hash('Admin123!', 12);
      const admin = new AdminUser({
        name: 'Initial Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('Admin user created: admin@tools-store.com / Admin123!');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
