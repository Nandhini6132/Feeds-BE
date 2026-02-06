import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import router from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'


dotenv.config();
const app = express();
app.use(cors({origin:'https://feeds-fe.onrender.com', credentials:true}))
// const allowedOrigins = [
//   /^https:\/\/.*\.local-credentialless\.webcontainer\.io$/,
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true); // Postman / server-to-server

//       const isAllowed = allowedOrigins.some((regex) =>
//         regex.test(origin)
//       );

//       if (isAllowed) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(cookieParser())
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
