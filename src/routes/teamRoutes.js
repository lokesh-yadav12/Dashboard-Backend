const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect } = require('../middleware/auth');
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');

// Validation rules
const teamMemberValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('department').optional().isIn(['Development', 'Design', 'Management', 'Quality Assurance', 'Marketing', 'Sales']).withMessage('Invalid department'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
];

// All routes require authentication
router.use(protect);

// Routes
router.route('/')
  .get(getTeamMembers)
  .post(teamMemberValidation, validate, createTeamMember);

router.route('/:id')
  .get(getTeamMember)
  .put(teamMemberValidation, validate, updateTeamMember)
  .delete(deleteTeamMember);

module.exports = router;