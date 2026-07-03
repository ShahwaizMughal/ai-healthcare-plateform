import { Schema, model } from 'mongoose';

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
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
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
