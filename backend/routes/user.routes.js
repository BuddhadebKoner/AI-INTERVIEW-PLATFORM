import express from 'express';
import {
   deleteUserProfile,
   getUserProfile,
   saveUserProfile,
   updateUserProfile,
} from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Save or create user profile (POST)
router.post('/profile', saveUserProfile);

// Get user profile (GET)
router.get('/profile', getUserProfile);

// Update user profile (PUT/PATCH)
router.put('/profile', updateUserProfile);
router.patch('/profile', updateUserProfile);

// Delete user profile (DELETE)
router.delete('/profile', deleteUserProfile);

export default router;
