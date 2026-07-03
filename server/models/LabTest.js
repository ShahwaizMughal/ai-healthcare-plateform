const mongoose = require('mongoose');

// Represents a single lab test in the catalog (Section 9.6 of the SRS).
const labTestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    // Enum inferred — SRS specifies "category" but not exact values (Inferred Requirement).
    category: {
      type: String,
      required: true,
      enum: ['Blood Test', 'Imaging', 'Cardiac', 'General Health', 'Diabetes', 'Other'],
    },
  },
  { timestamps: true }
);

// Index on category per Section 9.6 (grouped rendering / filtering).
labTestSchema.index({ category: 1 });

module.exports = mongoose.model('LabTest', labTestSchema);
