import { Schema, model } from 'mongoose';

// A patient's request to book a lab test
const labBookingSchema = new Schema(
  {
    labTestId: {
      type: Schema.Types.ObjectId,
      ref: 'LabTest',
      required: [true, 'Lab test ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Nullable for guests
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
      match: [/^\d{10,15}$/, 'contactPhone must be 10-15 digits'],
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
      validate: {
        // Preferred date must not be in the past
        validator(value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        },
        message: 'preferredDate cannot be in the past',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
labBookingSchema.index({ userId: 1 });
labBookingSchema.index({ status: 1 });

export default model('LabBooking', labBookingSchema);
