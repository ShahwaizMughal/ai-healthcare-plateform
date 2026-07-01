const mongoose = require('mongoose');

// Categorized emergency numbers, always-available and login-free (Section 9.7 / 3.6).
const emergencyContactSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Ambulance', 'Blood Bank', 'Hospital', 'Police'],
    },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    address: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// Index on category for grouped rendering (Section 9.7).
emergencyContactSchema.index({ category: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
