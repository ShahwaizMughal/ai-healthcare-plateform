/**
 * Seeds the emergencyContacts collection.
 * Run this file however the team's main seed runner calls per-module seeds
 * (check with M7 — they own overall seed orchestration per the SRS).
 * Standalone usage: node seed/emergency.js
 */
const mongoose = require('mongoose');
const EmergencyContact = require('../models/EmergencyContact');

const emergencyContacts = [
  { category: 'Ambulance', name: 'City Ambulance Service', phoneNumber: '1122', address: '' },
  { category: 'Blood Bank', name: 'Central Blood Bank', phoneNumber: '051-1234567', address: 'Main Road' },
  { category: 'Hospital', name: 'General Hospital Emergency', phoneNumber: '051-7654321', address: 'Hospital Road' },
  { category: 'Police', name: 'Police Emergency', phoneNumber: '15', address: '' },
];

async function seedEmergencyContacts() {
  await EmergencyContact.deleteMany({});
  await EmergencyContact.insertMany(emergencyContacts);
  console.log('Emergency contacts seeded.');
}

module.exports = seedEmergencyContacts;

// Allow running directly: `node seed/emergency.js`
if (require.main === module) {
  require('dotenv').config();
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(seedEmergencyContacts)
    .then(() => mongoose.disconnect())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
