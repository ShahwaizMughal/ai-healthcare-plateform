import { Schema, model } from 'mongoose';

const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    dosage: {
      type: String,
      required: [true, 'Dosage is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Pain Relief', 'Antibiotics', 'Vitamins', 'Skin Care', 'Cold & Flu'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
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
medicineSchema.index({ category: 1 });
medicineSchema.index({ price: 1 });
medicineSchema.index({ name: 'text' });

export default model('Medicine', medicineSchema);
