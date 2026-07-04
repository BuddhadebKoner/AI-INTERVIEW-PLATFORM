import { User } from '../models/user.js';

// Create or update user profile with resume data
export const saveUserProfile = async (req, res) => {
  try {
    const { clerkId } = req;
    const resumeData = req.body;

    // Validate required fields
    if (!resumeData.name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.name = resumeData.name;
      user.email = resumeData.email || user.email;
      user.phone = resumeData.phone || user.phone;
      user.location = resumeData.location || user.location;
      user.skills = resumeData.skills || user.skills;
      user.experience = resumeData.experience || user.experience;
      user.education = resumeData.education || user.education;
      user.summary = resumeData.summary || user.summary;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } else {
      // Create new user
      user = new User({
        clerkId,
        name: resumeData.name,
        email: resumeData.email,
        phone: resumeData.phone,
        location: resumeData.location,
        skills: resumeData.skills || [],
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        summary: resumeData.summary,
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: user,
      });
    }
  } catch (error) {
    console.error('Save user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save profile',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { clerkId } = req;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        needsProfileCreation: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Update specific fields in user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { clerkId } = req;
    const updates = req.body;

    // Find and update user
    const user = await User.findOneAndUpdate(
      { clerkId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        needsProfileCreation: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

// Delete user profile
export const deleteUserProfile = async (req, res) => {
  try {
    const { clerkId } = req;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile deleted successfully',
    });
  } catch (error) {
    console.error('Delete user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
    });
  }
};

export default {
  saveUserProfile,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
