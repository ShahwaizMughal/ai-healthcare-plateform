import { Schema, model } from 'mongoose';

// Categorized emergency numbers, always-available and login-free
const emergencyContactSchema = new Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Ambulance', 'Blood Bank', 'Hospital', 'Police'],
    },
    name: { 
      type: String, 
      required: [true, 'Contact name is required'], 
      trim: true 
    },
    phoneNumber: { 
      type: String, 
      required: [true, 'Phone number is required'], 
      trim: true 
    },
    address: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true 
  }
);

// Index on category for grouped rendering (Section 9.7)
emergencyContactSchema.index({ category: 1 });

export default model('EmergencyContact', emergencyContactSchema);
