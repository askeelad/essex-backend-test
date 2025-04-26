const { param, validationResult } = require('express-validator');
const { prisma } = require('../config/db');

const getHospitals = async (req, res) => {
  const hospitals = await prisma.hospital.findMany({
    include: { services: true },
  });
  res.json(hospitals);
};

const getServicesAndSlots = [
  param('hospitalId').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { hospitalId } = req.params;
    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    const services = await prisma.service.findMany({
      where: { hospitalId: parseInt(hospitalId) },
      include: {
        timeSlots: {
          where: { isBooked: false },
        },
      },
    });

    res.json(services);
  },
];

const bookAppointment = [
   param('serviceId').isInt(),
   param('timeSlotId').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, timeSlotId } = req.params;
    const user = req.user;

    const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const timeSlot = await prisma.timeSlot.findUnique({ where: { id: parseInt(timeSlotId) } });
    if (!timeSlot || timeSlot.isBooked || timeSlot.serviceId !== parseInt(serviceId)) {
      return res.status(400).json({ error: 'Invalid or booked time slot' });
    }

    const booking = await prisma.$transaction(async (prisma) => {
      await prisma.timeSlot.update({
        where: { id: timeSlot.id },
        data: { isBooked: true },
      });

      return prisma.booking.create({
        data: {
          userId: user.id,
          timeSlotId: timeSlot.id,
        },
      });
    });

    res.status(201).json({ message: 'Booking created', booking });
  },
];

module.exports = { getHospitals, getServicesAndSlots, bookAppointment };