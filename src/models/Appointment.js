const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // assuming doctors are stored in User model
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    treatment: {
      type: String,
      required: true
    },
    appointmentDate: {
      type: Date,
      required: true
    },
    nextDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Pending'],
      default: 'Scheduled'
    },
    notes: {
      type: String,
      default: ''
    },
    cost: {
      type: Number,
      default: 0
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    pendingAmount: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Partial', 'Unpaid'],
      default: 'Unpaid'
    },
    files: [
      {
        filename: String,
        url: String
      }
    ],
    patientPhone: {
      type: String
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model('Appointment', appointmentSchema);
