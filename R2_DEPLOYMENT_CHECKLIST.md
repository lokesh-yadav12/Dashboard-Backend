# R2 Storage Deployment Checklist

Use this checklist to ensure R2 storage is properly set up and working.

## Pre-Deployment

### Dependencies
- [ ] Installed `@aws-sdk/client-s3`
- [ ] Installed `@aws-sdk/s3-request-presigner`
- [ ] Verified installation: `npm list @aws-sdk/client-s3`

### Cloudflare Setup
- [ ] Created Cloudflare account
- [ ] Created R2 bucket
- [ ] Generated API token with "Object Read & Write" permissions
- [ ] Saved Account ID
- [ ] Saved Access Key ID
- [ ] Saved Secret Access Key

### Configuration
- [ ] Updated `STORAGE_TYPE=r2` in `.env`
- [ ] Set `R2_ACCOUNT_ID` in `.env`
- [ ] Set `R2_ACCESS_KEY_ID` in `.env`
- [ ] Set `R2_SECRET_ACCESS_KEY` in `.env`
- [ ] Set `R2_BUCKET_NAME` in `.env`
- [ ] Set `R2_PUBLIC_URL` in `.env`
- [ ] Restarted backend server

## Testing

### Basic Upload
- [ ] Upload a small image (< 1MB)
- [ ] Check file appears in R2 bucket
- [ ] Verify response includes signed URL
- [ ] Verify response shows `storage: 'r2'`

### File Types
- [ ] Upload image file (.jpg, .png)
- [ ] Upload PDF document
- [ ] Upload Word document (.doc, .docx)
- [ ] Upload other file types used in app

### Upload Types
- [ ] Test `profileImage` upload
- [ ] Test `qualificationDocument` upload
- [ ] Test `invoiceDocument` upload
- [ ] Test `clientDocument` upload
- [ ] Test `general` upload

### File Operations
- [ ] View uploaded file
- [ ] Download uploaded file
- [ ] Get signed URL for file
- [ ] Delete uploaded file
- [ ] Verify deleted file removed from R2

### Security
- [ ] Verify signed URLs expire after set time
- [ ] Verify files not accessible without signed URL
- [ ] Verify secure filenames are generated
- [ ] Verify files organized by type in R2

### Error Handling
- [ ] Test upload with no file
- [ ] Test upload with file > 5MB
- [ ] Test view non-existent file
- [ ] Test delete non-existent file
- [ ] Verify appropriate error messages

## Frontend Integration

### Upload Flow
- [ ] Upload file through frontend
- [ ] Verify success message shown
- [ ] Verify file appears in application
- [ ] Check browser console for errors

### View Flow
- [ ] View uploaded file in application
- [ ] Verify file displays correctly
- [ ] Check if images load properly
- [ ] Check if PDFs open correctly

### Download Flow
- [ ] Download file through application
- [ ] Verify file downloads correctly
- [ ] Verify filename is preserved

### Delete Flow
- [ ] Delete file through application
- [ ] Verify file removed from application
- [ ] Verify file removed from R2 bucket

## Migration (If Applicable)

### Existing Files
- [ ] Backed up local files
- [ ] Created migration script
- [ ] Tested migration with sample files
- [ ] Migrated all files to R2
- [ ] Verified file count matches
- [ ] Updated database records (if needed)

### Verification
- [ ] All old files accessible in R2
- [ ] No broken file links in application
- [ ] All file types working correctly

## Performance

### Speed
- [ ] Upload speed acceptable
- [ ] View/download speed acceptable
- [ ] No significant delays vs local storage

### Monitoring
- [ ] Check backend logs for errors
- [ ] Monitor R2 storage usage
- [ ] Monitor API request count
- [ ] Check for any rate limiting issues

## Production Readiness

### Security
- [ ] API tokens stored securely
- [ ] `.env` file not committed to git
- [ ] Signed URLs working correctly
- [ ] File access properly restricted

### Backup
- [ ] Local files backed up (if migrated)
- [ ] R2 bucket versioning enabled (optional)
- [ ] Backup strategy documented

### Documentation
- [ ] Team knows how to use R2
- [ ] Setup guide accessible
- [ ] Troubleshooting guide available
- [ ] API documentation updated

### Rollback Plan
- [ ] Know how to switch back to local storage
- [ ] Local files still available (if needed)
- [ ] Tested rollback procedure

## Post-Deployment

### Monitoring
- [ ] Check Cloudflare R2 dashboard daily
- [ ] Monitor storage usage
- [ ] Watch for errors in logs
- [ ] Track upload/download success rates

### Optimization
- [ ] Review signed URL expiry times
- [ ] Adjust file size limits if needed
- [ ] Consider enabling CDN (if needed)
- [ ] Set up lifecycle rules (optional)

### Maintenance
- [ ] Regular backup checks
- [ ] Periodic security audits
- [ ] Update dependencies as needed
- [ ] Review and clean up old files

## Troubleshooting Checklist

If something goes wrong:

- [ ] Check backend console logs
- [ ] Verify `.env` configuration
- [ ] Test with curl/Postman
- [ ] Check Cloudflare R2 dashboard
- [ ] Verify API token permissions
- [ ] Check network connectivity
- [ ] Review error messages carefully
- [ ] Test with small file first
- [ ] Verify bucket exists and is accessible
- [ ] Check CORS settings (if needed)

## Success Criteria

✓ All files upload successfully to R2
✓ Files can be viewed and downloaded
✓ Signed URLs work correctly
✓ Files organized properly in bucket
✓ No errors in backend logs
✓ Frontend works seamlessly
✓ Performance is acceptable
✓ Security measures in place
✓ Team can use and maintain system

## Sign-Off

- [ ] Development testing complete
- [ ] Staging testing complete (if applicable)
- [ ] Production deployment approved
- [ ] Team trained on R2 usage
- [ ] Documentation complete
- [ ] Monitoring in place

---

## Notes

Date deployed: _______________

Deployed by: _______________

R2 Bucket name: _______________

Any issues encountered: _______________

---

## Quick Commands

```bash
# Check dependencies
npm list @aws-sdk/client-s3

# Test R2 connection
node test-r2-connection.js

# View backend logs
npm start

# Switch to local storage
# Change STORAGE_TYPE=local in .env and restart

# Switch to R2 storage
# Change STORAGE_TYPE=r2 in .env and restart
```

---

## Support Resources

- R2_SETUP_GUIDE.md
- R2_QUICK_REFERENCE.md
- R2_IMPLEMENTATION_SUMMARY.md
- MIGRATE_TO_R2.md
- Cloudflare R2 Docs: https://developers.cloudflare.com/r2/
