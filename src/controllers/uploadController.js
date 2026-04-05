const path = require('path');
const fs = require('fs');
const { uploadToR2, getSignedFileUrl, deleteFromR2, fileExists } = require('../utils/r2Service');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local'; // 'local' or 'r2'

// Log storage configuration on module load
console.log('\n💾 [Storage Configuration]');
console.log(`   Storage type: ${STORAGE_TYPE.toUpperCase()}`);
if (STORAGE_TYPE === 'r2') {
  console.log(`   R2 Bucket: ${process.env.R2_BUCKET_NAME || 'NOT CONFIGURED'}`);
  console.log(`   R2 Account ID: ${process.env.R2_ACCOUNT_ID ? '✓ Set' : '✗ Not set'}`);
  console.log(`   R2 Access Key: ${process.env.R2_ACCESS_KEY_ID ? '✓ Set' : '✗ Not set'}`);
  console.log(`   R2 Secret Key: ${process.env.R2_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Not set'}`);
} else {
  console.log(`   Upload directory: Dashboard backend/uploads/`);
}
console.log('');

// @desc    Upload file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = async (req, res, next) => {
  try {
    console.log('\n📁 [Upload Request] Received file upload request');
    console.log(`   Storage type: ${STORAGE_TYPE}`);

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('   ❌ No files in request');
      return res.status(400).json({
        success: false,
        message: 'No files were uploaded'
      });
    }

    const file = req.files.file;
    const uploadType = req.body.uploadType || 'general'; // profileImage, qualificationDocument, invoiceDocument, clientDocument, general

    console.log(`   File name: ${file.name}`);
    console.log(`   Upload type: ${uploadType}`);
    console.log(`   File size: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`   MIME type: ${file.mimetype}`);

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.log('   ❌ File size exceeds 5MB limit');
      return res.status(400).json({
        success: false,
        message: 'File size should not exceed 5MB'
      });
    }

    if (STORAGE_TYPE === 'r2') {
      console.log('   → Using R2 storage');
      // Upload to R2
      const result = await uploadToR2(file.data, file.name, uploadType, file.mimetype);

      if (!result.success) {
        console.log('   ❌ R2 upload failed');
        return res.status(500).json({
          success: false,
          message: 'Error uploading file to R2',
          error: result.error
        });
      }

      // Generate signed URL for immediate access
      const urlResult = await getSignedFileUrl(uploadType, result.fileName, 3600); // 1 hour expiry

      console.log('   ✅ File uploaded successfully to R2');

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully to R2',
        data: {
          fileName: result.fileName,
          originalName: file.name,
          uploadType: uploadType,
          fileSize: file.size,
          mimeType: file.mimetype,
          storage: 'r2',
          url: urlResult.success ? urlResult.url : null,
          urlExpiresIn: urlResult.expiresIn
        }
      });
    } else {
      console.log('   → Using local storage');
      // Upload to local storage (existing logic)
      const uploadDir = path.join(__dirname, '../../uploads', uploadType);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`   Created directory: ${uploadDir}`);
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      console.log(`   Saving to: ${filePath}`);

      file.mv(filePath, (err) => {
        if (err) {
          console.log('   ❌ Local upload failed:', err.message);
          return res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: err.message
          });
        }

        console.log('   ✅ File uploaded successfully to local storage');

        res.status(200).json({
          success: true,
          message: 'File uploaded successfully',
          data: {
            fileName: fileName,
            originalName: file.name,
            filePath: `/uploads/${uploadType}/${fileName}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            storage: 'local'
          }
        });
      });
    }
  } catch (error) {
    console.error('   ❌ Upload error:', error);
    next(error);
  }
};

// @desc    Download file
// @route   GET /api/upload/download/:type/:filename
// @access  Private
exports.downloadFile = async (req, res, next) => {
  try {
    const { type, filename } = req.params;

    console.log(`\n⬇️  [Download Request] Type: ${type}, File: ${filename}`);
    console.log(`   Storage type: ${STORAGE_TYPE}`);

    if (STORAGE_TYPE === 'r2') {
      // Check if file exists in R2
      const exists = await fileExists(type, filename);
      if (!exists) {
        console.log('   ❌ File not found in R2');
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Generate signed URL for download
      const result = await getSignedFileUrl(type, filename, 300); // 5 minutes expiry for download

      if (!result.success) {
        console.log('   ❌ Failed to generate download URL');
        return res.status(500).json({
          success: false,
          message: 'Error generating download URL',
          error: result.error
        });
      }

      console.log('   ✅ Redirecting to signed URL');
      // Redirect to signed URL
      res.redirect(result.url);
    } else {
      // Local storage
      const filePath = path.join(__dirname, '../../uploads', type, filename);

      if (!fs.existsSync(filePath)) {
        console.log('   ❌ File not found in local storage');
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      console.log('   ✅ Sending file from local storage');
      res.download(filePath);
    }
  } catch (error) {
    console.error('   ❌ Download error:', error);
    next(error);
  }
};

// @desc    View file
// @route   GET /api/upload/view/:type/:filename
// @access  Private
exports.viewFile = async (req, res, next) => {
  try {
    const { type, filename } = req.params;

    if (STORAGE_TYPE === 'r2') {
      // Check if file exists in R2
      const exists = await fileExists(type, filename);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Generate signed URL for viewing
      const result = await getSignedFileUrl(type, filename, 3600); // 1 hour expiry for viewing

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: 'Error generating view URL',
          error: result.error
        });
      }

      // Redirect to signed URL
      res.redirect(result.url);
    } else {
      // Local storage
      const filePath = path.join(__dirname, '../../uploads', type, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      res.sendFile(filePath);
    }
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

    console.log(`\n🗑️  [Delete Request] Type: ${type}, File: ${filename}`);
    console.log(`   Storage type: ${STORAGE_TYPE}`);

    if (STORAGE_TYPE === 'r2') {
      // Delete from R2
      const result = await deleteFromR2(type, filename);

      if (!result.success) {
        console.log('   ❌ Failed to delete from R2');
        return res.status(500).json({
          success: false,
          message: 'Error deleting file from R2',
          error: result.error
        });
      }

      console.log('   ✅ File deleted from R2');

      res.status(200).json({
        success: true,
        message: 'File deleted successfully from R2'
      });
    } else {
      // Delete from local storage
      const filePath = path.join(__dirname, '../../uploads', type, filename);

      if (!fs.existsSync(filePath)) {
        console.log('   ❌ File not found in local storage');
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      fs.unlinkSync(filePath);
      console.log('   ✅ File deleted from local storage');

      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    }
  } catch (error) {
    console.error('   ❌ Delete error:', error);
    next(error);
  }
};

// @desc    Get signed URL for file
// @route   GET /api/upload/signed-url/:type/:filename
// @access  Private
exports.getSignedUrl = async (req, res, next) => {
  try {
    const { type, filename } = req.params;
    const expiresIn = parseInt(req.query.expiresIn) || 3600; // Default 1 hour

    if (STORAGE_TYPE !== 'r2') {
      return res.status(400).json({
        success: false,
        message: 'Signed URLs are only available for R2 storage'
      });
    }

    const result = await getSignedFileUrl(type, filename, expiresIn);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error generating signed URL',
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      url: result.url,
      expiresIn: result.expiresIn
    });
  } catch (error) {
    next(error);
  }
};
