import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import router from './routes/auth.routes.js';

dotenv.config();
const app = express();
app.use(
  cors()
);

app.use(express.json());
app.use('/feeds', router);
const PORT = process.env.PORT || 5000
connectToDB();

const startServer = async () => {
  try {
    await connectToDB();

    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });
  } catch (err) {
    console.error('Failed to start server', err);
  }
};

startServer();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
