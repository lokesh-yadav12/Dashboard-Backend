const path = require('path');
const fs = require('fs');

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    const file = req.files.file;
    const uploadType = req.body.uploadType || 'general'; // profileImage, qualificationDocument, invoiceDocument, general

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size should not exceed 5MB'
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads', uploadType);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Move file to uploads directory
    file.mv(filePath, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading file',
          error: err.message
        });
      }

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          fileName: fileName,
          originalName: file.name,
          filePath: `/uploads/${uploadType}/${fileName}`,
          fileSize: file.size,
          mimeType: file.mimetype
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download file
// @route   GET /api/upload/download/:type/:filename
// @access  Private
exports.downloadFile = async (req, res, next) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Send file
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

// @desc    View file
// @route   GET /api/upload/view/:type/:filename
// @access  Private
exports.viewFile = async (req, res, next) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Send file for viewing
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/upload/:type/:filename
// @access  Private
exports.deleteFile = async (req, res, next) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, '../../uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
