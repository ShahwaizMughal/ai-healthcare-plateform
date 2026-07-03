import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Null for guest bookings
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientAge: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age cannot exceed 120'],
    },
    patientGender: {
      type: String,
      required: [true, 'Patient gender is required'],
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    patientPhone: {
      type: String,
      required: [true, 'Patient phone is required'],
      trim: true,
    },
    reasonForVisit: {
      type: String,
      maxlength: [500, 'Reason for visit cannot exceed 500 characters'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      trim: true,
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

// Compound unique index to prevent double-booking the same slot for a doctor
appointmentSchema.index({ doctorId: 1, date: 1, timeSlot: 1 }, { unique: true });
appointmentSchema.index({ userId: 1 });

export default model('Appointment', appointmentSchema);
