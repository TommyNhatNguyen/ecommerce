import mongoose from 'mongoose';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
    );
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
