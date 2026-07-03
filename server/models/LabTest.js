import { Schema, model } from 'mongoose';

// Represents a single lab test in the catalog
const labTestSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Lab test name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Blood Test', 'Imaging', 'Cardiac', 'General Health', 'Diabetes', 'Other'],
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

// Index on category per Section 9.6 (grouped rendering / filtering)
labTestSchema.index({ category: 1 });

export default model('LabTest', labTestSchema);
