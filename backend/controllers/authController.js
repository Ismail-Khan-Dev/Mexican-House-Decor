import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { HTTP } from '../config/constants.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Register new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(HTTP.CONFLICT).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user (password hashed via pre-save hook)
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(HTTP.CREATED).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to create account',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(HTTP.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(HTTP.OK).json({
      success: true,
      message: 'Login successful',
      data: { user, token },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to login',
    });
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(HTTP.OK).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to get user profile',
    });
  }
};

/**
 * @desc    Update user profile (name, phone, address)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(HTTP.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

/**
 * @desc    Change password
 * @route   POST /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(HTTP.BAD_REQUEST).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    // Generate new token (optional, keeps session valid)
    const token = generateToken(user._id);

    res.status(HTTP.OK).json({
      success: true,
      message: 'Password changed successfully',
      data: { token },
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(HTTP.INTERNAL_ERROR).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};
