const router = require('express').Router();
const { getEmergencyContacts } = require('../controllers/emergencyController');

router.get('/emergency-contacts', getEmergencyContacts);

module.exports = router;
