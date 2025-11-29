import express from 'express';
import {
   createInterview,
   deleteInterview,
   getInterviewById,
   getUserInterviews,
   updateInterviewStatus,
} from '../controllers/interview.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Create new interview
router.post('/', createInterview);

// Get all interviews for logged-in user
router.get('/', getUserInterviews);

// Get single interview by ID
router.get('/:id', getInterviewById);

// Update interview status/results
router.patch('/:id', updateInterviewStatus);

// Delete interview
router.delete('/:id', deleteInterview);

export default router;
