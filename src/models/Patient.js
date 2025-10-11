const mongoose = require('mongoose');

// Counter schema for auto-incrementing patient IDs
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Patient schema
const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Patient name is required']
    },
    age: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: [0, 'Age cannot be negative']
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required']
    },
    email: {
      type: String,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    medicalHistory: {
      type: String,
      default: ''
    }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

// Pre-save middleware to auto-generate patientId
PatientSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // First check if Counter collection exists and has the patientId document
      let counter = await Counter.findById('patientId');
      
      if (!counter) {
        // If counter doesn't exist, create it with initial value
        counter = await Counter.create({ _id: 'patientId', seq: 0 });
      }
      
      // Now increment the counter
      counter = await Counter.findByIdAndUpdate(
        'patientId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      // Format: P0001, P0002, etc.
      this.patientId = `P${counter.seq.toString().padStart(4, '0')}`;
      console.log(`Generated new patient ID: ${this.patientId}`);
      next();
    } catch (error) {
      console.error('Error generating patient ID:', error);
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Patient', PatientSchema);
