import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

const availabilitySchema = new Schema({
  dayOfWeek: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  slots: {
    type: [String],
    required: true,
  },
});

const doctorSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Doctor full name is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: [
        'Cardiology',
        'Dermatology',
        'Pediatrics',
        'General Physician',
        'Dentistry',
        'Orthopedics',
        'Gynecology',
        'Neurology',
        'ENT',
        'Psychiatry',
      ],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    profileImageUrl: {
      type: String,
      required: [true, 'Profile image URL is required'],
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    availability: {
      type: [availabilitySchema],
      required: true,
      default: [],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Consultation fee cannot be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isFeatured: 1 });
doctorSchema.index({ fullName: 'text' });

export default model('Doctor', doctorSchema);
