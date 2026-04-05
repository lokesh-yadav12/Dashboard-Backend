# Migrate Existing Files from Local Storage to R2

This guide helps you migrate existing files from local storage to Cloudflare R2.

## Prerequisites

1. R2 is already set up (see R2_SETUP_GUIDE.md)
2. Backend dependencies are installed
3. R2 credentials are configured in `.env`

## Option 1: Manual Migration Script (Recommended)

Create a migration script to upload all existing files to R2:

### Step 1: Create Migration Script

Create a file `Dashboard backend/migrate-to-r2.js`:

```javascript
const fs = require('fs');
const path = require('path');
const { uploadToR2 } = require('./src/utils/r2Service');

async function migrateFiles() {
  const uploadsDir = path.join(__dirname, 'uploads');
  const uploadTypes = ['profileImage', 'qualificationDocument', 'invoiceDocument', 'clientDocument', 'general'];
  
  let totalFiles = 0;
  let successCount = 0;
  let errorCount = 0;

  console.log('Starting migration to R2...\n');

  for (const uploadType of uploadTypes) {
    const typeDir = path.join(uploadsDir, uploadType);
    
    if (!fs.existsSync(typeDir)) {
      console.log(`Skipping ${uploadType} - directory not found`);
      continue;
    }

    const files = fs.readdirSync(typeDir);
    console.log(`\nMigrating ${files.length} files from ${uploadType}...`);

    for (const filename of files) {
      const filePath = path.join(typeDir, filename);
      
      try {
        // Read file
        const fileBuffer = fs.readFileSync(filePath);
        const stats = fs.statSync(filePath);
        
        // Determine mime type
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'application/octet-stream';
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.doc') mimeType = 'application/msword';
        else if (ext === '.docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        // Upload to R2 with original filename
        const result = await uploadToR2(fileBuffer, filename, uploadType, mimeType);
        
        if (result.success) {
          console.log(`✓ Uploaded: ${filename}`);
          successCount++;
        } else {
          console.log(`✗ Failed: ${filename} - ${result.error}`);
          errorCount++;
        }
        
        totalFiles++;
      } catch (error) {
        console.log(`✗ Error: ${filename} - ${error.message}`);
        errorCount++;
        totalFiles++;
      }
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log(`Total files: ${totalFiles}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
}

// Run migration
migrateFiles().catch(console.error);
```

### Step 2: Run Migration

```bash
cd "Dashboard backend"
node migrate-to-r2.js
```

### Step 3: Verify Migration

1. Check your Cloudflare R2 bucket to see if files are uploaded
2. Test downloading/viewing files through the application
3. Compare file counts between local and R2

### Step 4: Switch to R2

Once verified, update `.env`:

```env
STORAGE_TYPE=r2
```

### Step 5: Backup and Clean Up (Optional)

After confirming everything works:

```bash
# Create backup of local files
cd "Dashboard backend"
tar -czf uploads-backup.tar.gz uploads/

# Optional: Delete local files to save space
# rm -rf uploads/
```

## Option 2: Fresh Start (No Migration)

If you don't need existing files:

1. Set `STORAGE_TYPE=r2` in `.env`
2. Restart backend server
3. All new uploads will go to R2
4. Old local files remain accessible until deleted

## Option 3: Gradual Migration

Keep both systems running:

1. Keep `STORAGE_TYPE=local` for now
2. Manually re-upload important files through the application
3. Once critical files are in R2, switch to `STORAGE_TYPE=r2`

## Database Considerations

If you're storing file paths in a database:

### For Local Storage
File paths look like: `/uploads/profileImage/1234567890-file.jpg`

### For R2 Storage
File paths are just filenames: `secure-random-name.jpg`

### Migration Strategy

If you have file paths in database:

1. **Option A**: Update database records to store just filenames
2. **Option B**: Keep full paths but update view logic to extract filename
3. **Option C**: Store both storage type and filename in database

Example database update:

```javascript
// Extract filename from path
const filename = filePath.split('/').pop();

// Update record
await updateRecord({
  fileName: filename,
  storage: 'r2'
});
```

## Frontend Considerations

The frontend should work automatically because:

1. Upload API returns the same structure for both storage types
2. View/Download endpoints handle both storage types transparently
3. Signed URLs are generated automatically for R2

### If you need to update frontend code:

```typescript
// Old way (local storage)
const imageUrl = `http://localhost:5000/uploads/profileImage/${filename}`;

// New way (works for both local and R2)
const imageUrl = uploadAPI.viewFile('profileImage', filename);

// Or for R2 with custom expiry
const response = await uploadAPI.getSignedUrl('profileImage', filename, 7200);
const imageUrl = response.data.url;
```

## Rollback Plan

If something goes wrong:

1. Change `.env` back to `STORAGE_TYPE=local`
2. Restart backend server
3. Local files are still available
4. Debug R2 issues before trying again

## Testing Checklist

Before fully migrating:

- [ ] Upload a test file
- [ ] View the uploaded file
- [ ] Download the uploaded file
- [ ] Delete a test file
- [ ] Check file appears in R2 bucket
- [ ] Verify signed URLs work
- [ ] Test with different file types (images, PDFs, documents)
- [ ] Test file size limits
- [ ] Verify error handling

## Common Issues

### Files upload but can't be viewed

- Check R2_PUBLIC_URL in `.env`
- Verify signed URL generation is working
- Check CORS settings in R2 bucket

### Migration script fails

- Verify R2 credentials are correct
- Check network connectivity
- Ensure bucket exists and is accessible
- Check file permissions on local files

### Mixed storage (some local, some R2)

- This is normal during migration
- Keep track of which files are where
- Consider adding a `storage` field to your database

## Best Practices

1. **Test First**: Migrate a small batch of files first
2. **Backup**: Always backup local files before deleting
3. **Verify**: Check R2 bucket after migration
4. **Monitor**: Watch for errors in backend logs
5. **Document**: Keep track of what's been migrated

## Support

If you need help:
1. Check backend console for detailed error messages
2. Verify R2 credentials and bucket settings
3. Test with a single file first
4. Review R2_SETUP_GUIDE.md for configuration help
