import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    responsibilities: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [experienceSchema],
    education: [educationSchema],
    summary: {
      type: String,
      trim: true,
    },
    account: {
      isActive: {
        type: Boolean,
        default: true,
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });

export const User = mongoose.model('User', userSchema);
