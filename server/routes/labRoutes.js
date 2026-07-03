const router = require('express').Router();
const { getLabTests, createLabBooking } = require('../controllers/labController');

router.get('/lab-tests', getLabTests);
router.post('/lab-bookings', createLabBooking);

module.exports = router;
