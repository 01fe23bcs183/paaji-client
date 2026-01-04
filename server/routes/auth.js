import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { sendWelcomeEmail } from '../services/emailService.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        // Generate token
        const token = generateToken(user.id);

        // Send welcome email (async, don't wait)
        sendWelcomeEmail(user.toSafeObject()).catch(err => console.error('Error sending welcome email:', err));

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: user.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user.id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user.toSafeObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.json({
        success: true,
        message: 'Logout successful'
    });
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const { verifyToken } = await import('../middleware/auth.js');
        const decoded = verifyToken(token);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: user.toSafeObject()
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
});

export default router;
