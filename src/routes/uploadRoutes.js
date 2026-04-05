const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  uploadFile,
  downloadFile,
  viewFile,
  deleteFile,
  getSignedUrl
} = require('../controllers/uploadController');

// Temporarily remove protect middleware for testing
// TODO: Add back protect middleware when using backend authentication
router.post('/', uploadFile);
router.get('/download/:type/:filename', downloadFile);
router.get('/view/:type/:filename', viewFile);
router.delete('/:type/:filename', deleteFile);
router.get('/signed-url/:type/:filename', getSignedUrl);

module.exports = router;
