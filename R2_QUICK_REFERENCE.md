# R2 Storage Quick Reference

## Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd "Dashboard backend"
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. Get R2 Credentials
1. Go to https://dash.cloudflare.com/
2. Click "R2" → "Create bucket" → Name it (e.g., `dashboard-files`)
3. Click "Manage R2 API Tokens" → "Create API token"
4. Copy: Account ID, Access Key ID, Secret Access Key

### 3. Update .env
```env
STORAGE_TYPE=r2
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=dashboard-files
R2_PUBLIC_URL=https://dashboard-files.your-account-id.r2.cloudflarestorage.com
```

### 4. Restart Server
```bash
# Stop server (Ctrl+C), then:
npm start
```

### 5. Test
Upload a file through your application and check the R2 bucket!

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload file |
| GET | `/api/upload/view/:type/:filename` | View file |
| GET | `/api/upload/download/:type/:filename` | Download file |
| GET | `/api/upload/signed-url/:type/:filename` | Get signed URL |
| DELETE | `/api/upload/:type/:filename` | Delete file |

---

## Upload Types

- `profileImage` - Profile pictures
- `qualificationDocument` - Certificates, degrees
- `invoiceDocument` - Invoices, receipts
- `clientDocument` - Client files
- `general` - Other files

---

## Storage Type Switch

```env
# Local storage (default)
STORAGE_TYPE=local

# R2 cloud storage
STORAGE_TYPE=r2
```

---

## File Structure in R2

```
dashboard/
├── profileImage/
├── qualificationDocument/
├── invoiceDocument/
├── clientDocument/
└── general/
```

---

## Security Features

✓ Signed URLs (expire after set time)
✓ Secure random filenames
✓ Private bucket (not publicly accessible)
✓ Type-based organization

---

## URL Expiry Times

- View: 1 hour
- Download: 5 minutes
- Custom: Set via `?expiresIn=seconds`

---

## Frontend Usage

```typescript
// Upload
const response = await uploadAPI.uploadFile(file, 'profileImage');

// View (works for both local and R2)
const url = uploadAPI.viewFile('profileImage', fileName);

// Get signed URL (R2 only)
const response = await uploadAPI.getSignedUrl('profileImage', fileName, 3600);

// Delete
await uploadAPI.deleteFile('profileImage', fileName);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Missing credentials | Check `.env` file |
| Bucket not found | Verify bucket name |
| Access denied | Check API token permissions |
| Files not uploading | Check backend logs |

---

## Cost (Cloudflare R2)

- 10 GB storage FREE
- No egress fees
- Perfect for small/medium apps

---

## Documentation Files

- `R2_SETUP_GUIDE.md` - Detailed setup instructions
- `MIGRATE_TO_R2.md` - Migrate existing files
- `R2_IMPLEMENTATION_SUMMARY.md` - Technical details
- `INSTALL_R2_DEPENDENCIES.md` - Dependency installation

---

## Need Help?

1. Check backend console logs
2. Review `R2_SETUP_GUIDE.md`
3. Verify `.env` configuration
4. Test with small file first
5. Check Cloudflare R2 dashboard
