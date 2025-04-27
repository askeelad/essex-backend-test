const { Router } = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { getHospitals, getServicesAndSlots, bookAppointment } = require('../controllers/bookingController');
const { createHospital, createService, createTimeSlot } = require('../controllers/adminController');
const rateLimit = require('express-rate-limit');
const { authMiddleware, isAdminMiddleware } = require('../middleware/auth');

const router = Router();

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

//Login Routes
router.post('/register', register);
router.post('/login', login);
router.post('/refreshToken', refreshToken);

// Admin routes
router.post('/admin/hospital', authMiddleware, isAdminMiddleware, createHospital);
router.post('/admin/service', authMiddleware, isAdminMiddleware, createService);
router.post('/admin/timeslot', authMiddleware, isAdminMiddleware, createTimeSlot);

//Booking Routes
router.get('/hospitals', authMiddleware, getHospitals);
router.get('/services/:hospitalId', authMiddleware, getServicesAndSlots);
router.post('/book/:serviceId/:timeSlotId', authMiddleware, bookAppointment);

module.exports = router;