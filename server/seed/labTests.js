/**
 * Seeds the labTests collection. No stub existed for this in seed/ yet,
 * so this is a new file (not overwriting anyone else's).
 * Standalone usage: node seed/labTests.js
 */
const mongoose = require('mongoose');
const LabTest = require('../models/LabTest');

const labTests = [
  { name: 'Complete Blood Count (CBC)', description: 'General blood health panel.', price: 500, category: 'Blood Test' },
  { name: 'Lipid Profile', description: 'Cholesterol and triglyceride levels.', price: 800, category: 'Blood Test' },
  { name: 'Chest X-Ray', description: 'Digital chest imaging.', price: 1200, category: 'Imaging' },
  { name: 'ECG', description: 'Electrocardiogram — heart rhythm check.', price: 700, category: 'Cardiac' },
  { name: 'HbA1c', description: '3-month average blood sugar level.', price: 900, category: 'Diabetes' },
  { name: 'Full Body Checkup', description: 'Comprehensive general health panel.', price: 2500, category: 'General Health' },
];

async function seedLabTests() {
  await LabTest.deleteMany({});
  await LabTest.insertMany(labTests);
  console.log('Lab tests seeded.');
}

module.exports = seedLabTests;

if (require.main === module) {
  require('dotenv').config();
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(seedLabTests)
    .then(() => mongoose.disconnect())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
