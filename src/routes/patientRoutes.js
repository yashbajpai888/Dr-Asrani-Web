const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect, doctor } = require('../middleware/authMiddleware');

// 🩺 GET all patients (Doctor access)
router.get('/', protect, doctor, async (req, res) => {
  try {
    const patients = await Patient.find({}).sort({ createdAt: -1 }); // latest first
    res.json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 POST: Create a new patient
router.post('/', protect, doctor, async (req, res) => {
  try {
    const { name, age, gender, contactNumber, email, address } = req.body;

    if (!name || !age || !gender || !contactNumber) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, message: 'Patient created successfully', data: patient });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 GET patient by ID
router.get('/:id', protect, doctor, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 PUT: Update patient
router.put('/:id', protect, doctor, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    Object.assign(patient, req.body);
    const updatedPatient = await patient.save();

    res.json({ success: true, message: 'Patient updated successfully', data: updatedPatient });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 DELETE: Delete patient
router.delete('/:id', protect, doctor, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    await patient.deleteOne(); // updated from remove() to deleteOne()
    res.json({ success: true, message: 'Patient removed successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
