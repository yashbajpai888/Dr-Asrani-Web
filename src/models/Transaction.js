const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    paymentType: {
      type: String,
      enum: ['credit', 'debit'],
      required: [true, 'Payment type is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    notes: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending'
    }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model('Transaction', TransactionSchema);
