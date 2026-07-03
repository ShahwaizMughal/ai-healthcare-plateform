const EmergencyContact = require('../models/EmergencyContact');

// GET /api/emergency-contacts — grouped by category.
exports.getEmergencyContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find().sort({ category: 1, name: 1 });

    const grouped = contacts.reduce((acc, c) => {
      if (!acc[c.category]) acc[c.category] = [];
      acc[c.category].push(c);
      return acc;
    }, {});

    res.status(200).json({ success: true, data: { contacts: grouped } });
  } catch (err) {
    next(err);
  }
};
