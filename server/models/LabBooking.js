const mongoose = require('mongoose');

// A patient's request to book a lab test (Section 9.6 / 3.5).
const labBookingSchema = new mongoose.Schema(
  {
    labTestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
    // Nullable — guest bookings are allowed, consistent with Appointments/Checkout (Section 3.5).
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    patientName: { type: String, required: true, trim: true },
    contactPhone: {
      type: String,
      required: true,
      match: [/^\d{10,15}$/, 'contactPhone must be 10-15 digits'],
    },
    preferredDate: {
      type: Date,
      required: true,
      validate: {
        // Preferred date must not be in the past (Section 3.5 validation rule).
        validator(value) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today;
        },
        message: 'preferredDate cannot be in the past',
      },
    },
    // Same status lifecycle pattern as Appointments, for shared Admin UI (Section 3.5).
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

labBookingSchema.index({ userId: 1 });
labBookingSchema.index({ status: 1 });

module.exports = mongoose.model('LabBooking', labBookingSchema);
