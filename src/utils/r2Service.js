const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

// Initialize R2 client
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const BASE_FOLDER = 'dashboard'; // All files will be under dashboard/

/**
 * Generate a secure random filename
 */
const generateSecureFilename = (originalName) => {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
};

/**
 * Get the full R2 key path
 * Format: dashboard/{uploadType}/{filename}
 */
const getR2Key = (uploadType, filename) => {
    return `${BASE_FOLDER}/${uploadType}/${filename}`;
};

/**
 * Upload file to R2
 */
const uploadToR2 = async (fileBuffer, originalName, uploadType, mimeType) => {
    try {
        console.log('\n📤 [R2 Upload] Starting upload...');
        console.log(`   Original filename: ${originalName}`);
        console.log(`   Upload type: ${uploadType}`);
        console.log(`   MIME type: ${mimeType}`);
        console.log(`   File size: ${(fileBuffer.length / 1024).toFixed(2)} KB`);

        const secureFilename = generateSecureFilename(originalName);
        const key = getR2Key(uploadType, secureFilename);

        console.log(`   Secure filename: ${secureFilename}`);
        console.log(`   R2 key: ${key}`);
        console.log(`   Bucket: ${BUCKET_NAME}`);

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
            Metadata: {
                originalName: originalName,
                uploadType: uploadType,
                uploadDate: new Date().toISOString()
            }
        });

        await r2Client.send(command);

        console.log('   ✅ Upload successful!');

        return {
            success: true,
            fileName: secureFilename,
            key: key,
            uploadType: uploadType
        };
    } catch (error) {
        console.error('   ❌ R2 Upload Error:', error.message);
        console.error('   Error details:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Generate a signed URL for secure file access
 * URL expires after specified time (default 1 hour)
 */
const getSignedFileUrl = async (uploadType, filename, expiresIn = 3600) => {
    try {
        const key = getR2Key(uploadType, filename);

        console.log(`\n🔗 [R2 Signed URL] Generating signed URL for: ${key}`);
        console.log(`   Expires in: ${expiresIn} seconds (${(expiresIn / 60).toFixed(1)} minutes)`);

        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });

        console.log('   ✅ Signed URL generated successfully');

        return {
            success: true,
            url: signedUrl,
            expiresIn: expiresIn
        };
    } catch (error) {
        console.error('   ❌ R2 Signed URL Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get public URL (if bucket has public access configured)
 * Note: This requires R2 bucket to have public access enabled
 */
const getPublicUrl = (uploadType, filename) => {
    const key = getR2Key(uploadType, filename);
    return `${process.env.R2_PUBLIC_URL}/${key}`;
};

/**
 * Check if file exists in R2
 */
const fileExists = async (uploadType, filename) => {
    try {
        const key = getR2Key(uploadType, filename);

        console.log(`\n🔍 [R2 Check] Checking if file exists: ${key}`);

        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await r2Client.send(command);
        console.log('   ✅ File exists');
        return true;
    } catch (error) {
        if (error.name === 'NotFound') {
            console.log('   ❌ File not found');
            return false;
        }
        console.error('   ❌ Error checking file existence:', error.message);
        throw error;
    }
};

/**
 * Delete file from R2
 */
const deleteFromR2 = async (uploadType, filename) => {
    try {
        const key = getR2Key(uploadType, filename);

        console.log(`\n🗑️  [R2 Delete] Deleting file: ${key}`);

        const command = new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        await r2Client.send(command);

        console.log('   ✅ File deleted successfully');

        return {
            success: true,
            message: 'File deleted successfully'
        };
    } catch (error) {
        console.error('   ❌ R2 Delete Error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get file metadata
 */
const getFileMetadata = async (uploadType, filename) => {
    try {
        const key = getR2Key(uploadType, filename);

        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        const response = await r2Client.send(command);

        return {
            success: true,
            metadata: {
                contentType: response.ContentType,
                contentLength: response.ContentLength,
                lastModified: response.LastModified,
                metadata: response.Metadata
            }
        };
    } catch (error) {
        console.error('R2 Metadata Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    uploadToR2,
    getSignedFileUrl,
    getPublicUrl,
    fileExists,
    deleteFromR2,
    getFileMetadata,
    r2Client
};
