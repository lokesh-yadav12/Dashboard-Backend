const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please provide client name'],
    trim: true
  },
  projectName: {
    type: String,
    required: [true, 'Please provide project name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  contact: {
    type: String,
    required: [true, 'Please provide contact number'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['live', 'development', 'completed'],
    default: 'development'
  },
  lastPayment: {
    type: String,
    default: 'No payment yet'
  },
  lastMeetNote: {
    type: String,
    default: 'Initial meeting scheduled'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
clientSchema.index({ clientName: 'text', projectName: 'text', email: 'text' });
clientSchema.index({ userId: 1, startDate: -1 });

module.exports = mongoose.model('Client', clientSchema);