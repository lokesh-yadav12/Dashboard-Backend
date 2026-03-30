const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect } = require('../middleware/auth');
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientsByDateRange
} = require('../controllers/clientController');

// Validation rules
const clientValidation = [
  body('clientName').trim().notEmpty().withMessage('Client name is required'),
  body('projectName').trim().notEmpty().withMessage('Project name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('contact').trim().notEmpty().withMessage('Contact number is required'),
  body('status').optional().isIn(['live', 'development', 'completed']).withMessage('Invalid status')
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getClients)
  .post(clientValidation, validate, createClient);

router.route('/filter')
  .get(getClientsByDateRange);

router.route('/:id')
  .get(getClient)
  .put(clientValidation, validate, updateClient)
  .delete(deleteClient);

module.exports = router;