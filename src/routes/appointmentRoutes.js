const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect, doctor } = require('../middleware/authMiddleware');

// 🩺 GET: All Appointments (Doctor access)
router.get('/', protect, doctor, async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name contactNumber email')
      .sort({ date: 1 }); // upcoming first
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Failed to fetch appointments from server' });
  }
});

// 🩺 POST: Create New Appointment (Doctor access)
router.post('/', protect, doctor, async (req, res) => {
  try {
    const { patient, date, time, description, status } = req.body;

    if (!patient || !date || !time) {
      return res.status(400).json({ message: 'Patient, date, and time are required' });
    }

    const appointment = await Appointment.create({
      patient,
      doctor: req.user._id,
      date,
      time,
      description: description || '',
      status: status || 'scheduled'
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
});

// 🩺 GET: Appointment by ID (Doctor access)
router.get('/:id', protect, doctor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name contactNumber email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment by ID:', error);
    res.status(500).json({ message: 'Server Error while fetching appointment' });
  }
});

// 🩺 PUT: Update Appointment (Doctor access)
router.put('/:id', protect, doctor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    Object.assign(appointment, req.body);
    const updatedAppointment = await appointment.save();

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
});

// 🩺 DELETE: Delete Appointment (Doctor access)
router.delete('/:id', protect, doctor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Failed to delete appointment' });
  }
});

module.exports = router;
