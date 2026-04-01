const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: [true, 'Please provide client name']
  },
  projectName: {
    type: String,
    required: [true, 'Please provide project name']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Please provide payment date'],
    default: Date.now
  },
  totalInstallments: {
    type: Number,
    required: [true, 'Please provide total installments'],
    min: [1, 'Total installments must be at least 1']
  },
  currentInstallment: {
    type: Number,
    required: [true, 'Please provide current installment'],
    min: [1, 'Current installment must be at least 1']
  },
  installment: {
    type: String,
    required: true
  },
  remaining: {
    type: String,
    required: true
  },
  invoiceNumber: {
    type: String,
    required: [true, 'Please provide invoice number'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending'
  },
  description: {
    type: String,
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Check', 'Other'],
    default: 'Bank Transfer'
  },
  invoiceDocument: {
    type: String,
    trim: true
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
paymentSchema.index({ clientName: 'text', projectName: 'text', invoiceNumber: 'text' });
paymentSchema.index({ userId: 1, date: -1 });
paymentSchema.index({ clientId: 1 });

// Virtual for checking if payment is completed
paymentSchema.virtual('isCompleted').get(function() {
  return this.currentInstallment === this.totalInstallments;
});

// Pre-save middleware to calculate installment and remaining
paymentSchema.pre('save', function(next) {
  this.installment = `${this.currentInstallment}/${this.totalInstallments}`;
  
  if (this.currentInstallment === this.totalInstallments) {
    this.remaining = 'Project Completed';
  } else {
    const remainingCount = this.totalInstallments - this.currentInstallment;
    this.remaining = `${remainingCount} installment${remainingCount > 1 ? 's' : ''} remaining`;
  }
  
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);