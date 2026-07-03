import { Schema, model } from 'mongoose';

const labTestSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Lab test name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
labTestSchema.index({ category: 1 });

export default model('LabTest', labTestSchema);
