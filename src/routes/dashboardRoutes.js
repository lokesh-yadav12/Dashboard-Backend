const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStats,
  getClientData,
  getProjectData,
  getProjectStatus
} = require('../controllers/dashboardController');

// All routes require authentication
router.use(protect);

// Routes
router.get('/stats', getStats);
router.get('/clients', getClientData);
router.get('/projects', getProjectData);
router.get('/project-status', getProjectStatus);

module.exports = router;