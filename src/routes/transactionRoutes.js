const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect, doctor } = require('../middleware/authMiddleware');

// 🩺 GET all transactions (Doctor access)
router.get('/', protect, doctor, async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate('patient', 'name contactNumber email')
      .sort({ createdAt: -1 }); // latest first
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 POST: Create new transaction
router.post('/', protect, doctor, async (req, res) => {
  try {
    const { patient, amount, paymentType, status, notes } = req.body;

    if (!patient || !amount || !paymentType) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const transaction = await Transaction.create(req.body);
    res.status(201).json({ success: true, message: 'Transaction created', data: transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 GET transactions by patient ID
router.get('/patient/:patientId', protect, doctor, async (req, res) => {
  try {
    const transactions = await Transaction.find({ patient: req.params.patientId })
      .populate('patient', 'name contactNumber email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions for patient:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 PUT: Update transaction
router.put('/:id', protect, doctor, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    Object.assign(transaction, req.body);
    const updatedTransaction = await transaction.save();

    res.json({ success: true, message: 'Transaction updated', data: updatedTransaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// 🩺 DELETE: Delete transaction
router.delete('/:id', protect, doctor, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.json({ success: true, message: 'Transaction removed successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
