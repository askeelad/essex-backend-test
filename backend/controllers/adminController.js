const { body, validationResult } = require('express-validator');
const { prisma } = require('../config/db');

const createHospital = [
  body('name').isString().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const hospital = await prisma.hospital.create({
        data: { name },
      });
      res.status(201).json({ message: 'Hospital created', hospital });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create hospital' });
    }
  },
];

const createService = [
  body('name').isString().notEmpty(),
  body('hospitalId').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, hospitalId } = req.body;

    try {
      const hospital = await prisma.hospital.findUnique({ where: { id: parseInt(hospitalId) } });
      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
      }

      const service = await prisma.service.create({
        data: { name, hospitalId: parseInt(hospitalId) },
      });
      res.status(201).json({ message: 'Service created', service });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create service' });
    }
  },
];

const createTimeSlot = [
  body('serviceId').isInt(),
  body('time').isISO8601(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId, time } = req.body;

    try {
      const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const timeSlot = await prisma.timeSlot.create({
        data: {
          time: new Date(time),
          serviceId: parseInt(serviceId),
        },
      });
      res.status(201).json({ message: 'Time slot created', timeSlot });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create time slot' });
    }
  },
];

module.exports = { createHospital, createService, createTimeSlot };