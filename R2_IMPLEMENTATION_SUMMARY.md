# R2 Storage Implementation Summary

## Overview

The dashboard now supports Cloudflare R2 cloud storage as an alternative to local file storage. This provides better security, scalability, and reliability for file management.

## What Was Implemented

### 1. R2 Service Utility (`src/utils/r2Service.js`)

A comprehensive service for interacting with Cloudflare R2:

- **uploadToR2()**: Upload files with secure random filenames
- **getSignedFileUrl()**: Generate temporary signed URLs for secure access
- **deleteFromR2()**: Delete files from R2 bucket
- **fileExists()**: Check if a file exists in R2
- **getFileMetadata()**: Get file information

Files are stored in structure: `dashboard/{uploadType}/{secure-filename}`

### 2. Updated Upload Controller (`src/controllers/uploadController.js`)

Enhanced to support both local and R2 storage:

- **uploadFile**: Uploads to R2 or local based on STORAGE_TYPE
- **downloadFile**: Generates signed URLs for R2, direct download for local
- **viewFile**: Generates signed URLs for R2, direct view for local
- **deleteFile**: Deletes from R2 or local
- **getSignedUrl**: New endpoint to get signed URLs on demand

### 3. Updated Routes (`src/routes/uploadRoutes.js`)

Added new route:
- `GET /api/upload/signed-url/:type/:filename?expiresIn=3600`

### 4. Frontend API Service (`Dashboard frontend/src/services/api.ts`)

Updated uploadAPI with:
- **getSignedUrl()**: Fetch signed URLs for R2 files
- **viewFile()**: Updated to use API endpoint instead of hardcoded URL

### 5. Environment Configuration

Added to `.env`:
```env
STORAGE_TYPE=local  # or 'r2'
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
```

## Security Features

1. **Signed URLs**: All file access uses temporary URLs that expire
   - View URLs: 1 hour expiry
   - Download URLs: 5 minutes expiry
   - Custom expiry available via API

2. **Secure Filenames**: Original filenames replaced with crypto-random names
   - Format: `{timestamp}-{random-hex}.{extension}`
   - Prevents filename-based attacks

3. **Private Bucket**: Files not publicly accessible without signed URLs

4. **Type-based Organization**: Files organized by upload type in separate folders

## File Upload Types

- `profileImage`: User profile pictures
- `qualificationDocument`: Educational/certification documents
- `invoiceDocument`: Invoice and payment documents
- `clientDocument`: Client-related documents
- `general`: Other files

## How It Works

### Upload Flow (R2)

1. Client uploads file via POST /api/upload
2. Backend generates secure filename
3. File uploaded to R2 at `dashboard/{type}/{filename}`
4. Signed URL generated for immediate access
5. Response includes filename, URL, and expiry time

### View/Download Flow (R2)

1. Client requests file via GET /api/upload/view/:type/:filename
2. Backend checks if file exists in R2
3. Generates signed URL with appropriate expiry
4. Redirects client to signed URL
5. Client accesses file directly from R2

### Delete Flow (R2)

1. Client requests deletion via DELETE /api/upload/:type/:filename
2. Backend deletes file from R2
3. Returns success confirmation

## Switching Between Storage Types

Simply change `STORAGE_TYPE` in `.env`:

```env
# Use local storage
STORAGE_TYPE=local

# Use R2 storage
STORAGE_TYPE=r2
```

No code changes needed - the controller handles both transparently.

## API Response Examples

### Upload Response (R2)
```json
{
  "success": true,
  "message": "File uploaded successfully to R2",
  "data": {
    "fileName": "1712345678901-a3f2d9e8b1c4.pdf",
    "originalName": "document.pdf",
    "uploadType": "clientDocument",
    "fileSize": 245678,
    "mimeType": "application/pdf",
    "storage": "r2",
    "url": "https://signed-url.r2.cloudflarestorage.com/...",
    "urlExpiresIn": 3600
  }
}
```

### Upload Response (Local)
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileName": "1712345678901-document.pdf",
    "originalName": "document.pdf",
    "filePath": "/uploads/clientDocument/1712345678901-document.pdf",
    "fileSize": 245678,
    "mimeType": "application/pdf",
    "storage": "local"
  }
}
```

### Get Signed URL Response
```json
{
  "success": true,
  "url": "https://signed-url.r2.cloudflarestorage.com/...",
  "expiresIn": 3600
}
```

## Frontend Usage Examples

### Upload File
```typescript
const response = await uploadAPI.uploadFile(file, 'profileImage');
const { fileName, url, storage } = response.data.data;

// For R2, url is a signed URL that expires
// For local, use viewFile() to get the URL
```

### View File
```typescript
// Works for both local and R2
const fileUrl = uploadAPI.viewFile('profileImage', fileName);

// For R2 with custom expiry
const response = await uploadAPI.getSignedUrl('profileImage', fileName, 7200);
const fileUrl = response.data.url;
```

### Delete File
```typescript
await uploadAPI.deleteFile('profileImage', fileName);
```

## Files Created/Modified

### New Files
- `Dashboard backend/src/utils/r2Service.js`
- `Dashboard backend/R2_SETUP_GUIDE.md`
- `Dashboard backend/MIGRATE_TO_R2.md`
- `Dashboard backend/R2_IMPLEMENTATION_SUMMARY.md` (this file)
- `Dashboard backend/INSTALL_R2_DEPENDENCIES.md`

### Modified Files
- `Dashboard backend/src/controllers/uploadController.js`
- `Dashboard backend/src/routes/uploadRoutes.js`
- `Dashboard backend/.env`
- `Dashboard frontend/src/services/api.ts`

## Next Steps

### To Use Local Storage (Current Default)
1. No action needed - already configured
2. Files stored in `Dashboard backend/uploads/`

### To Use R2 Storage
1. Follow `R2_SETUP_GUIDE.md` to set up Cloudflare R2
2. Install dependencies: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner`
3. Configure R2 credentials in `.env`
4. Change `STORAGE_TYPE=r2` in `.env`
5. Restart backend server
6. (Optional) Migrate existing files using `MIGRATE_TO_R2.md`

## Benefits of R2 Storage

1. **Scalability**: No local disk space limitations
2. **Security**: Signed URLs prevent unauthorized access
3. **Reliability**: Cloudflare's infrastructure ensures high availability
4. **Cost-Effective**: 10GB free tier, no egress fees
5. **Performance**: Global CDN for fast file delivery
6. **Backup**: Built-in redundancy and durability

## Limitations

1. **Internet Required**: R2 requires internet connectivity
2. **API Calls**: Each file operation makes an API call
3. **Signed URLs**: URLs expire and need regeneration
4. **Migration**: Existing local files need manual migration

## Troubleshooting

See `R2_SETUP_GUIDE.md` for detailed troubleshooting steps.

Common issues:
- Missing credentials → Check `.env` configuration
- Bucket not found → Verify bucket name and account ID
- Access denied → Check API token permissions
- Files not uploading → Check backend logs for errors

## Testing

Before deploying to production:

1. Test file upload with both storage types
2. Verify file viewing/downloading works
3. Test file deletion
4. Check signed URL expiration
5. Test with different file types and sizes
6. Verify error handling

## Support

For issues or questions:
1. Check backend console logs
2. Review setup guides
3. Verify environment configuration
4. Test with small files first
5. Check Cloudflare R2 dashboard

## Conclusion

The R2 storage implementation is complete and ready to use. The system supports both local and R2 storage with seamless switching between them. Follow the setup guides to enable R2 storage when ready.
