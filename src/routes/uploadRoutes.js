const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  uploadFile,
  downloadFile,
  viewFile,
  deleteFile
} = require('../controllers/uploadController');

// Temporarily remove protect middleware for testing
// TODO: Add back protect middleware when using backend authentication
router.post('/', uploadFile);
router.get('/download/:type/:filename', downloadFile);
router.get('/view/:type/:filename', viewFile);
router.delete('/:type/:filename', deleteFile);

module.exports = router;
