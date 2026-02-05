import User from '../models/User.js';
import bcrypt from 'bcryptjs';

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
    const user = await User.findOne({ email: email });

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

    res.status(200).json({
      message: 'Login Successful',
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error,
    });
  }
};
