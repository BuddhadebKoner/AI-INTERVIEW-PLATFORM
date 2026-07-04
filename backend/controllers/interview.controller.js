import { Interview } from '../models/interview.js';
import { User } from '../models/user.js';
import { generateInterviewQuestions } from '../services/questionGenerator.service.js';

// Create new interview session
export const createInterview = async (req, res) => {
  try {
    const { clerkId } = req;
    const { interviewType, language, region, complexity } = req.body;

    // Validate required fields
    if (!language || !region || !complexity) {
      return res.status(400).json({
        success: false,
        message: 'Language, region, and complexity are required',
      });
    }

    // Get user profile
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please create your profile first.',
        needsProfileCreation: true,
      });
    }

    // Generate interview questions using AI
    console.log('Generating interview questions with AI...');
    const questions = await generateInterviewQuestions({
      interviewType: interviewType || 'General Interview',
      complexity,
      skills: user.skills || [],
      experience: user.experience || [],
      candidateName: user.name,
    });

    // Create interview with user data snapshot and generated questions
    const interview = new Interview({
      userId: user._id,
      clerkId,
      interviewType: interviewType || 'General Interview',
      language,
      region,
      complexity,
      candidateInfo: {
        name: user.name,
        skills: user.skills || [],
        experience: user.experience || [],
        summary: user.summary || '',
      },
      questions,
      status: 'initiated',
    });

    await interview.save();

    return res.status(201).json({
      success: true,
      message: 'Interview initiated successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Create interview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create interview',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Get all interviews for a user
export const getUserInterviews = async (req, res) => {
  try {
    const { clerkId } = req;

    const interviews = await Interview.find({ clerkId })
      .sort({ createdAt: -1 })
      .select('-__v');

    return res.status(200).json({
      success: true,
      message: 'Interviews retrieved successfully',
      data: interviews,
      count: interviews.length,
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve interviews',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Get single interview by ID
export const getInterviewById = async (req, res) => {
  try {
    const { clerkId } = req;
    const { id } = req.params;

    const interview = await Interview.findOne({
      _id: id,
      clerkId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Interview retrieved successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Get interview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve interview',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Update interview status
export const updateInterviewStatus = async (req, res) => {
  try {
    const { clerkId } = req;
    const { id } = req.params;
    const { status, score, feedback, duration, questions } = req.body;

    const interview = await Interview.findOne({
      _id: id,
      clerkId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    // Update fields if provided
    if (status) interview.status = status;
    if (score !== undefined) interview.score = score;
    if (feedback) interview.feedback = feedback;
    if (duration) interview.duration = duration;
    if (questions) interview.questions = questions;

    // Set completion time if status is completed
    if (status === 'completed' && !interview.completedAt) {
      interview.completedAt = new Date();
    }

    await interview.save();

    return res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: interview,
    });
  } catch (error) {
    console.error('Update interview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update interview',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Delete interview
export const deleteInterview = async (req, res) => {
  try {
    const { clerkId } = req;
    const { id } = req.params;

    const interview = await Interview.findOneAndDelete({
      _id: id,
      clerkId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete interview',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

export default {
  createInterview,
  getUserInterviews,
  getInterviewById,
  updateInterviewStatus,
  deleteInterview,
};
