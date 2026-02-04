import mongoose from 'mongoose';

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongodb connected');
  } catch (err) {
    console.log(err, 'error');
    process.exit(1);
  }
};

export default connectToDB;
