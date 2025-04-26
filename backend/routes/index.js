const { Router } = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { getHospitals, getServicesAndSlots, bookAppointment } = require('../controllers/bookingController');
const rateLimit = require('express-rate-limit');

const router = Router();

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

router.post('/register', register);
router.post('/login', login);
router.post('/refreshToken', refreshToken);
router.get('/hospitals', authMiddleware, getHospitals);
router.post('/services', authMiddleware, getServicesAndSlots);
router.post('/book', authMiddleware, bookAppointment);

module.exports = router;