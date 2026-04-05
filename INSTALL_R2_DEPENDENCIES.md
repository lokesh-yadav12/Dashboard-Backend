# Install R2 Dependencies

## Step 1: Install Required Packages

Run this command in the Dashboard backend directory:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

These packages are needed for Cloudflare R2 integration (R2 is S3-compatible).

## Step 2: Verify Installation

Check that the packages were installed correctly:

```bash
npm list @aws-sdk/client-s3
npm list @aws-sdk/s3-request-presigner
```

You should see the package versions listed without errors.

## Step 3: Test R2 Connection (Optional)

After configuring your R2 credentials in `.env`, you can test the connection:

```bash
node test-r2-connection.js
```

This will:
- Verify all environment variables are set
- Test connection to R2
- Upload a test file
- Download and verify the test file
- Delete the test file
- Show success or error messages

## What These Packages Do

- `@aws-sdk/client-s3`: AWS SDK for S3-compatible storage (R2 uses S3 API)
- `@aws-sdk/s3-request-presigner`: Generates signed URLs for secure file access

## Next Steps

After installation:
1. Follow `R2_SETUP_GUIDE.md` to configure R2
2. Run `test-r2-connection.js` to verify setup
3. Set `STORAGE_TYPE=r2` in `.env`
4. Restart your backend server

## Troubleshooting

### Installation fails
- Make sure you're in the `Dashboard backend` directory
- Check your internet connection
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### Package not found after installation
- Restart your terminal/IDE
- Check `package.json` to see if packages are listed
- Try reinstalling: `npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner --save`
