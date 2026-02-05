import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log('register......................');
  const { name, email, password } = req.body;
  console.log(req.body, 'body');

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashpassword,
    });
    res.status(201).json({
      message: 'User created successfuly',
      user: {
        name: user?.name,
        id: user?._id,
        email: user?.email,
        password: user?.password,
      },
    });
  } catch (err) {
    console.log(err, 'error');
    return res.status(500).json({
      message: 'server error',
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not registered',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: 'Password is wrong',
      });
    }

    const accessToken=jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRIES_IN})

    const refreshToken=jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"1d"})

    res.cookie('refreshToken', refreshToken,{
      httpOnly:true,
      secure:true,
      sameSite:'none'
    })

    res.status(200).json({
      message: 'Login Successful',
      userId: user._id,
      accessToken,
    });
  }
   catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error,
    });
  }
};

export const refreshToken=async(req,res)=>{
  const refreshTok=req.cookies.refreshToken
  if(!refreshTok){
    return res.status(401).json({
      message:'No Refresh token found'
    })
  }

  try{
    const decoded=jwt.verify(refreshTok,process.env.JWT_SECRET)
    const newAccessToken=jwt.sign({userId:decoded.userId},process.env.JWT_SECRET,{expiresIn:'15m'})

    res.json({accessToken:newAccessToken})

  }
  catch(error){
    return res.status(403).json({
      message:'Invalid refresh token'
    })
  }
}
