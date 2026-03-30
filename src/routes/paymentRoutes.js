const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect } = require('../middleware/auth');
const {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  recordInstallment,
  getClientPayments,
  getPaymentAnalytics
} = require('../controllers/paymentController');

// Validation rules
const paymentValidation = [
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('projectName').trim().notEmpty().withMessage('Project name is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('totalInstallments').isInt({ min: 1 }).withMessage('Total installments must be at least 1'),
  body('currentInstallment').isInt({ min: 1 }).withMessage('Current installment must be at least 1'),
  body('invoiceNumber').trim().notEmpty().withMessage('Invoice number is required'),
  body('status').optional().isIn(['paid', 'pending', 'overdue']).withMessage('Invalid status')
];

const installmentValidation = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
  body('description').optional().trim()
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getPayments)
  .post(paymentValidation, validate, createPayment);

router.route('/analytics')
  .get(getPaymentAnalytics);

router.route('/client/:clientId')
  .get(getClientPayments);

router.route('/:id')
  .get(getPayment)
  .put(updatePayment)
  .delete(deletePayment);

router.route('/:id/installments')
  .post(installmentValidation, validate, recordInstallment);

module.exports = router;