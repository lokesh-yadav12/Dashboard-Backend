# Cloudflare R2 Storage Setup Guide

This guide will help you set up Cloudflare R2 storage for your dashboard application.

## What is Cloudflare R2?

Cloudflare R2 is an S3-compatible object storage service that stores files in the cloud. It's more secure and scalable than local file storage.

## Prerequisites

1. A Cloudflare account (free tier available)
2. Node.js and npm installed

## Step 1: Install Required Dependencies

Run this command in the `Dashboard backend` folder:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## Step 2: Create R2 Bucket in Cloudflare

1. Log in to your Cloudflare dashboard: https://dash.cloudflare.com/
2. Click on "R2" in the left sidebar
3. Click "Create bucket"
4. Enter a bucket name (e.g., `dashboard-files`)
5. Choose a location (automatic is fine)
6. Click "Create bucket"

## Step 3: Get R2 API Credentials

1. In the R2 section, click "Manage R2 API Tokens"
2. Click "Create API token"
3. Give it a name (e.g., "Dashboard API Token")
4. Set permissions to "Object Read & Write"
5. (Optional) Restrict to specific bucket
6. Click "Create API Token"
7. **IMPORTANT**: Copy and save these values immediately (you won't see them again):
   - Access Key ID
   - Secret Access Key
   - Account ID (shown at the top of the page)

## Step 4: Configure Environment Variables

Open `Dashboard backend/.env` and update these values:

```env
# Storage Configuration
STORAGE_TYPE=r2
# Change from 'local' to 'r2' to enable R2 storage

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=dashboard-files
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
```

### How to get R2_PUBLIC_URL:

1. Go to your bucket in Cloudflare R2
2. Click on "Settings"
3. Under "Public access", you'll see the public URL
4. If public access is not enabled, you can enable it (optional - we use signed URLs for security)
5. The URL format is: `https://<bucket-name>.<account-id>.r2.cloudflarestorage.com`

## Step 5: Restart Backend Server

After updating the `.env` file, restart your backend server:

```bash
# Stop the server (Ctrl+C)
# Then start it again
npm start
```

## Step 6: Test File Upload

1. Start your frontend application
2. Try uploading a file (profile image, document, etc.)
3. Check your Cloudflare R2 bucket to see if the file appears

## File Structure in R2

Files are organized in the following structure:

```
dashboard/
├── profileImage/
│   └── secure-random-filename.jpg
├── qualificationDocument/
│   └── secure-random-filename.pdf
├── invoiceDocument/
│   └── secure-random-filename.pdf
├── clientDocument/
│   └── secure-random-filename.pdf
└── general/
    └── secure-random-filename.ext
```

## Security Features

1. **Signed URLs**: All file access uses temporary signed URLs that expire after a set time
2. **Secure Filenames**: Original filenames are replaced with secure random names
3. **Private Bucket**: Files are not publicly accessible without signed URLs
4. **Expiring Links**: 
   - View URLs expire after 1 hour
   - Download URLs expire after 5 minutes
   - Upload response URLs expire after 1 hour

## Switching Between Local and R2 Storage

To switch storage types, simply change the `STORAGE_TYPE` in `.env`:

- `STORAGE_TYPE=local` - Files stored in `Dashboard backend/uploads/`
- `STORAGE_TYPE=r2` - Files stored in Cloudflare R2

**Note**: Existing files won't be automatically migrated. You'll need to manually upload them to R2 if needed.

## Troubleshooting

### Error: "Missing credentials in config"

- Make sure all R2 environment variables are set correctly in `.env`
- Restart the backend server after changing `.env`

### Error: "The specified bucket does not exist"

- Check that `R2_BUCKET_NAME` matches your actual bucket name in Cloudflare
- Bucket names are case-sensitive

### Error: "Access Denied"

- Verify your API token has "Object Read & Write" permissions
- Check that the Access Key ID and Secret Access Key are correct

### Files not appearing in R2

- Check the backend console for error messages
- Verify `STORAGE_TYPE=r2` in `.env`
- Make sure the backend server was restarted after changing `.env`

## Cost Information

Cloudflare R2 offers:
- **10 GB storage** per month (free tier)
- **No egress fees** (unlike AWS S3)
- Very affordable pricing beyond free tier

Perfect for small to medium applications!

## API Endpoints

### Upload File
```
POST /api/upload
Body: FormData with 'file' and 'uploadType'
Response: { success, data: { fileName, url, urlExpiresIn, storage: 'r2' } }
```

### Get Signed URL
```
GET /api/upload/signed-url/:type/:filename?expiresIn=3600
Response: { success, url, expiresIn }
```

### Download File
```
GET /api/upload/download/:type/:filename
Response: Redirects to signed URL
```

### View File
```
GET /api/upload/view/:type/:filename
Response: Redirects to signed URL
```

### Delete File
```
DELETE /api/upload/:type/:filename
Response: { success, message }
```

## Next Steps

Once R2 is working:
1. Consider enabling bucket versioning for backup
2. Set up lifecycle rules to auto-delete old files
3. Monitor storage usage in Cloudflare dashboard
4. Consider enabling CORS if needed for direct browser uploads

## Support

If you encounter issues:
1. Check the backend console logs
2. Verify all environment variables are set
3. Test with a small file first
4. Check Cloudflare R2 dashboard for bucket status
