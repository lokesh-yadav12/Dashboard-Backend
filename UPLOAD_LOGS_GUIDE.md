# Upload Logs Guide

This guide explains the logging system for file uploads in the backend.

## Startup Logs

When the backend server starts, you'll see storage configuration:

### Local Storage
```
💾 [Storage Configuration]
   Storage type: LOCAL
   Upload directory: Dashboard backend/uploads/
```

### R2 Storage
```
💾 [Storage Configuration]
   Storage type: R2
   R2 Bucket: dashboard-files
   R2 Account ID: ✓ Set
   R2 Access Key: ✓ Set
   R2 Secret Key: ✓ Set
```

If R2 credentials are missing:
```
💾 [Storage Configuration]
   Storage type: R2
   R2 Bucket: NOT CONFIGURED
   R2 Account ID: ✗ Not set
   R2 Access Key: ✗ Not set
   R2 Secret Key: ✗ Not set
```

---

## Upload Logs

### Local Storage Upload

```
📁 [Upload Request] Received file upload request
   Storage type: local
   File name: profile.jpg
   Upload type: profileImage
   File size: 245.67 KB
   MIME type: image/jpeg
   → Using local storage
   Created directory: C:\...\Dashboard backend\uploads\profileImage
   Saving to: C:\...\Dashboard backend\uploads\profileImage\1712345678901-profile.jpg
   ✅ File uploaded successfully to local storage
```

### R2 Storage Upload

```
📁 [Upload Request] Received file upload request
   Storage type: r2
   File name: document.pdf
   Upload type: clientDocument
   File size: 1234.56 KB
   MIME type: application/pdf
   → Using R2 storage

📤 [R2 Upload] Starting upload...
   Original filename: document.pdf
   Upload type: clientDocument
   MIME type: application/pdf
   File size: 1234.56 KB
   Secure filename: 1712345678901-a3f2d9e8b1c4f5a6.pdf
   R2 key: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
   Bucket: dashboard-files
   ✅ Upload successful!

🔗 [R2 Signed URL] Generating signed URL for: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
   Expires in: 3600 seconds (60.0 minutes)
   ✅ Signed URL generated successfully

   ✅ File uploaded successfully to R2
```

### Upload Error (File Too Large)

```
📁 [Upload Request] Received file upload request
   Storage type: local
   File name: large-file.zip
   Upload type: general
   File size: 6789.12 KB
   MIME type: application/zip
   ❌ File size exceeds 5MB limit
```

### Upload Error (No File)

```
📁 [Upload Request] Received file upload request
   Storage type: local
   ❌ No files in request
```

---

## Download Logs

### Local Storage Download

```
⬇️  [Download Request] Type: profileImage, File: 1712345678901-profile.jpg
   Storage type: local
   ✅ Sending file from local storage
```

### R2 Storage Download

```
⬇️  [Download Request] Type: clientDocument, File: 1712345678901-a3f2d9e8b1c4f5a6.pdf
   Storage type: r2

🔍 [R2 Check] Checking if file exists: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
   ✅ File exists

🔗 [R2 Signed URL] Generating signed URL for: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
   Expires in: 300 seconds (5.0 minutes)
   ✅ Signed URL generated successfully

   ✅ Redirecting to signed URL
```

### Download Error (File Not Found)

```
⬇️  [Download Request] Type: profileImage, File: nonexistent.jpg
   Storage type: r2

🔍 [R2 Check] Checking if file exists: dashboard/profileImage/nonexistent.jpg
   ❌ File not found

   ❌ File not found in R2
```

---

## Delete Logs

### Local Storage Delete

```
🗑️  [Delete Request] Type: profileImage, File: 1712345678901-profile.jpg
   Storage type: local
   ✅ File deleted from local storage
```

### R2 Storage Delete

```
🗑️  [Delete Request] Type: clientDocument, File: 1712345678901-a3f2d9e8b1c4f5a6.pdf
   Storage type: r2

🗑️  [R2 Delete] Deleting file: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
   ✅ File deleted successfully

   ✅ File deleted from R2
```

### Delete Error (File Not Found)

```
🗑️  [Delete Request] Type: profileImage, File: nonexistent.jpg
   Storage type: local
   ❌ File not found in local storage
```

---

## Signed URL Generation Logs

### Successful Generation

```
🔗 [R2 Signed URL] Generating signed URL for: dashboard/profileImage/1712345678901-a3f2d9e8b1c4f5a6.jpg
   Expires in: 7200 seconds (120.0 minutes)
   ✅ Signed URL generated successfully
```

### Error (R2 Not Configured)

```
❌ Signed URLs are only available for R2 storage
```

---

## Log Symbols

| Symbol | Meaning |
|--------|---------|
| 📁 | Upload request received |
| 📤 | R2 upload in progress |
| ⬇️ | Download request |
| 🗑️ | Delete request |
| 🔗 | Signed URL generation |
| 🔍 | File existence check |
| 💾 | Storage configuration |
| ✅ | Success |
| ❌ | Error/Failure |
| → | Action being taken |

---

## Error Logs

### R2 Connection Error

```
📤 [R2 Upload] Starting upload...
   Original filename: document.pdf
   Upload type: clientDocument
   MIME type: application/pdf
   File size: 1234.56 KB
   Secure filename: 1712345678901-a3f2d9e8b1c4f5a6.pdf
   R2 key: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
   Bucket: dashboard-files
   ❌ R2 Upload Error: Missing credentials in config
   Error details: [Full error stack trace]
```

### R2 Bucket Not Found

```
   ❌ R2 Upload Error: The specified bucket does not exist
   Error details: [Full error stack trace]
```

### R2 Access Denied

```
   ❌ R2 Upload Error: Access Denied
   Error details: [Full error stack trace]
```

---

## Debugging Tips

### Check Storage Type
Look for the startup log to confirm which storage type is active:
```
💾 [Storage Configuration]
   Storage type: LOCAL  (or R2)
```

### Verify R2 Configuration
If using R2, check that all credentials are set:
```
   R2 Account ID: ✓ Set
   R2 Access Key: ✓ Set
   R2 Secret Key: ✓ Set
```

### Track Upload Flow
Follow the emoji symbols to track the upload process:
1. 📁 Request received
2. 📤 Upload starting (R2 only)
3. 🔗 Signed URL generation (R2 only)
4. ✅ Success

### Identify Errors
Look for ❌ symbols to quickly spot errors in the logs.

### File Size Issues
Check the file size in the logs:
```
   File size: 6789.12 KB  ← If > 5120 KB (5MB), will be rejected
```

### R2 Key Path
Verify the R2 key path is correct:
```
   R2 key: dashboard/clientDocument/1712345678901-a3f2d9e8b1c4f5a6.pdf
           ^^^^^^^^^ ^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
           Folder    Upload Type    Secure Filename
```

---

## Log Levels

All logs are sent to `console.log` and `console.error`:

- **Info logs**: `console.log` - Normal operations
- **Error logs**: `console.error` - Errors and failures

To see logs:
1. Run backend server: `npm start`
2. Watch the console output
3. Perform file operations in the application

---

## Production Considerations

In production, you may want to:

1. **Use a logging library** (e.g., Winston, Bunyan)
2. **Log to files** instead of console
3. **Add log levels** (debug, info, warn, error)
4. **Include timestamps** (already in secure filenames)
5. **Add request IDs** for tracking
6. **Reduce verbosity** for performance

Example with Winston:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Replace console.log with logger.info
logger.info('Upload request received', { filename, uploadType, fileSize });
```

---

## Testing Logs

To test the logging system:

1. **Start backend server**
   ```bash
   cd "Dashboard backend"
   npm start
   ```

2. **Upload a file** through your application

3. **Check console output** for logs

4. **Try different scenarios**:
   - Upload small file
   - Upload large file (> 5MB)
   - Upload to different types
   - Download file
   - Delete file
   - Switch storage types

---

## Troubleshooting with Logs

### Problem: Files not uploading

**Check logs for:**
```
❌ File size exceeds 5MB limit
❌ No files in request
❌ R2 Upload Error: [error message]
```

### Problem: Can't download files

**Check logs for:**
```
❌ File not found
❌ Error generating download URL
```

### Problem: R2 not working

**Check startup logs:**
```
R2 Account ID: ✗ Not set  ← Missing credentials
```

**Check upload logs:**
```
❌ R2 Upload Error: Missing credentials in config
```

---

## Summary

The logging system provides:
- ✅ Clear visual indicators (emojis)
- ✅ Detailed operation tracking
- ✅ Error identification
- ✅ Storage type confirmation
- ✅ File metadata logging
- ✅ R2 key path verification
- ✅ Signed URL expiry tracking

Use these logs to monitor file operations and debug issues quickly!
