import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// ─── Generate a signed JWT token for the given user ID ───────────────────────
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// ─── @desc   Register a new user ─────────────────────────────────────────────
// ─── @route  POST /api/auth/register
// ─── @access Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists by email
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password using bcryptjs before storing in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user — assignedCourses, stars, assessmentsPassed get defaults from schema
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    if (user) {
      // Respond with user data + JWT so the client can authenticate immediately
      res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        stars: user.stars,
        assessmentsPassed: user.assessmentsPassed,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Authenticate a user and get a token ────────────────────────────
// ─── @route  POST /api/auth/login
// ─── @access Public
export const authUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN INPUT:", email, password);

    const user = await User.findOne({ email });

    console.log("USER FROM DB:", user);

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    console.log("STORED HASH:", user.password);

    const isMatch = await bcrypt.compare(password, user.password as string);

    console.log("PASSWORD MATCH:", isMatch);

    if (isMatch) {
      res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        stars: user.stars,
        assessmentsPassed: user.assessmentsPassed,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Authenticate a staff/admin user and get a token ────────────────
// ─── @route  POST /api/auth/staff
// ─── @access Public
export const authStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      res.status(401).json({ message: 'Invalid staff credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid staff credentials' });
      return;
    }

    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      stars: user.stars,
      assessmentsPassed: user.assessmentsPassed,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    console.error('🔥 STAFF LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Get the logged-in user's profile ────────────────────────────────
// ─── @route  GET /api/auth/profile
// ─── @access Private
export const getUserProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      stars: user.stars,
      assessmentsPassed: user.assessmentsPassed,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── @desc   Update user profile ─────────────────────────────────────────────
// ─── @route  PUT /api/auth/profile
// ─── @access Private
export const updateUserProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.profileImage !== undefined) {
        user.profileImage = req.body.profileImage;
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        stars: updatedUser.stars,
        assessmentsPassed: updatedUser.assessmentsPassed,
        profileImage: updatedUser.profileImage,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
