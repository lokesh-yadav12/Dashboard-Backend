# R2 Storage Documentation Index

Complete guide to Cloudflare R2 storage integration for the Dashboard application.

## 📚 Documentation Files

### 🚀 Getting Started

1. **[R2_QUICK_REFERENCE.md](R2_QUICK_REFERENCE.md)**
   - 5-minute quick setup guide
   - Essential commands and endpoints
   - Quick troubleshooting tips
   - **Start here for fastest setup!**

2. **[INSTALL_R2_DEPENDENCIES.md](INSTALL_R2_DEPENDENCIES.md)**
   - Install required npm packages
   - Verify installation
   - Test R2 connection
   - Troubleshoot installation issues

3. **[R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md)**
   - Complete step-by-step setup instructions
   - How to create R2 bucket
   - How to get API credentials
   - Environment configuration
   - Security features explained
   - Detailed troubleshooting

### 📦 Migration & Deployment

4. **[MIGRATE_TO_R2.md](MIGRATE_TO_R2.md)**
   - Migrate existing local files to R2
   - Migration script examples
   - Database considerations
   - Rollback procedures
   - Testing checklist

5. **[R2_DEPLOYMENT_CHECKLIST.md](R2_DEPLOYMENT_CHECKLIST.md)**
   - Pre-deployment checklist
   - Testing procedures
   - Production readiness checks
   - Post-deployment monitoring
   - Sign-off documentation

### 🔧 Technical Documentation

6. **[R2_IMPLEMENTATION_SUMMARY.md](R2_IMPLEMENTATION_SUMMARY.md)**
   - Technical implementation details
   - API endpoints and responses
   - Code examples
   - Security features
   - File structure
   - Frontend/backend integration

### 🧪 Testing

7. **[test-r2-connection.js](test-r2-connection.js)**
   - Automated R2 connection test script
   - Verifies credentials
   - Tests upload/download/delete
   - Color-coded output
   - Run: `node test-r2-connection.js`

---

## 🎯 Quick Navigation

### I want to...

#### Set up R2 for the first time
1. Read [R2_QUICK_REFERENCE.md](R2_QUICK_REFERENCE.md) (5 min)
2. Follow [INSTALL_R2_DEPENDENCIES.md](INSTALL_R2_DEPENDENCIES.md)
3. Follow [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md)
4. Run `node test-r2-connection.js`

#### Migrate existing files to R2
1. Ensure R2 is set up (see above)
2. Follow [MIGRATE_TO_R2.md](MIGRATE_TO_R2.md)
3. Use [R2_DEPLOYMENT_CHECKLIST.md](R2_DEPLOYMENT_CHECKLIST.md)

#### Understand how R2 works
1. Read [R2_IMPLEMENTATION_SUMMARY.md](R2_IMPLEMENTATION_SUMMARY.md)
2. Review code in `src/utils/r2Service.js`
3. Check `src/controllers/uploadController.js`

#### Deploy to production
1. Complete [R2_DEPLOYMENT_CHECKLIST.md](R2_DEPLOYMENT_CHECKLIST.md)
2. Test thoroughly in staging first
3. Monitor using Cloudflare dashboard

#### Troubleshoot issues
1. Check [R2_QUICK_REFERENCE.md](R2_QUICK_REFERENCE.md) troubleshooting section
2. Run `node test-r2-connection.js`
3. Review [R2_SETUP_GUIDE.md](R2_SETUP_GUIDE.md) troubleshooting section
4. Check backend console logs

---

## 📋 Implementation Overview

### What Was Built

The dashboard now supports two storage modes:

1. **Local Storage** (default)
   - Files stored in `Dashboard backend/uploads/`
   - No external dependencies
   - Good for development

2. **R2 Cloud Storage**
   - Files stored in Cloudflare R2
   - Secure signed URLs
   - Scalable and reliable
   - Good for production

### Key Features

✅ Seamless switching between local and R2 storage
✅ Secure signed URLs with expiration
✅ Organized file structure by type
✅ Automatic secure filename generation
✅ Support for multiple file types
✅ Complete CRUD operations
✅ Error handling and validation
✅ Frontend integration ready

### File Types Supported

- Profile images (JPG, PNG, GIF)
- PDF documents
- Word documents (DOC, DOCX)
- Other common file types

### Upload Types

- `profileImage` - User profile pictures
- `qualificationDocument` - Certificates, degrees
- `invoiceDocument` - Invoices, receipts
- `clientDocument` - Client-related files
- `general` - Other files

---

## 🔐 Security Features

1. **Signed URLs**
   - Temporary access links
   - Configurable expiration
   - Prevents unauthorized access

2. **Secure Filenames**
   - Random crypto-generated names
   - Prevents filename-based attacks
   - Original names preserved in metadata

3. **Private Bucket**
   - Files not publicly accessible
   - Access only via signed URLs
   - Controlled permissions

4. **Type-based Organization**
   - Files organized by upload type
   - Easy to manage and audit
   - Clear folder structure

---

## 🛠️ Technical Stack

### Backend
- Node.js + Express
- AWS SDK for S3 (R2 compatible)
- Cloudflare R2 storage
- Environment-based configuration

### Frontend
- TypeScript
- Axios for API calls
- React (implied from context)
- Seamless storage abstraction

### Dependencies
```json
{
  "@aws-sdk/client-s3": "^3.x.x",
  "@aws-sdk/s3-request-presigner": "^3.x.x"
}
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload file |
| GET | `/api/upload/view/:type/:filename` | View file |
| GET | `/api/upload/download/:type/:filename` | Download file |
| GET | `/api/upload/signed-url/:type/:filename` | Get signed URL |
| DELETE | `/api/upload/:type/:filename` | Delete file |

---

## 🌐 Environment Variables

```env
# Storage type
STORAGE_TYPE=local  # or 'r2'

# R2 Configuration (required when STORAGE_TYPE=r2)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your-bucket.r2.cloudflarestorage.com
```

---

## 📁 File Structure

### Backend Files
```
Dashboard backend/
├── src/
│   ├── utils/
│   │   └── r2Service.js          # R2 service utility
│   ├── controllers/
│   │   └── uploadController.js   # Upload controller (updated)
│   └── routes/
│       └── uploadRoutes.js       # Upload routes (updated)
├── test-r2-connection.js         # Connection test script
├── .env                          # Environment config
└── Documentation/
    ├── R2_QUICK_REFERENCE.md
    ├── R2_SETUP_GUIDE.md
    ├── R2_IMPLEMENTATION_SUMMARY.md
    ├── MIGRATE_TO_R2.md
    ├── R2_DEPLOYMENT_CHECKLIST.md
    ├── INSTALL_R2_DEPENDENCIES.md
    └── R2_DOCUMENTATION_INDEX.md (this file)
```

### Frontend Files
```
Dashboard frontend/
└── src/
    └── services/
        └── api.ts                # API service (updated)
```

---

## 💡 Best Practices

1. **Development**: Use local storage (`STORAGE_TYPE=local`)
2. **Production**: Use R2 storage (`STORAGE_TYPE=r2`)
3. **Testing**: Always test with small files first
4. **Security**: Never commit `.env` file to git
5. **Backup**: Keep backups of important files
6. **Monitoring**: Check Cloudflare dashboard regularly
7. **Migration**: Test migration script before full migration
8. **Documentation**: Keep team informed of storage type

---

## 🆘 Support & Resources

### Internal Documentation
- All documentation files in this directory
- Code comments in `src/utils/r2Service.js`
- Test script: `test-r2-connection.js`

### External Resources
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/)

### Troubleshooting Steps
1. Check backend console logs
2. Run `node test-r2-connection.js`
3. Verify `.env` configuration
4. Review relevant documentation
5. Check Cloudflare R2 dashboard
6. Test with curl/Postman

---

## 📈 Next Steps

### Immediate
- [ ] Install dependencies
- [ ] Set up R2 bucket
- [ ] Configure environment variables
- [ ] Test connection
- [ ] Upload test file

### Short-term
- [ ] Migrate existing files (if needed)
- [ ] Update frontend to use new API
- [ ] Test all file operations
- [ ] Deploy to staging

### Long-term
- [ ] Monitor storage usage
- [ ] Optimize signed URL expiry times
- [ ] Set up lifecycle rules
- [ ] Consider CDN integration
- [ ] Regular security audits

---

## 📝 Version History

- **v1.0** - Initial R2 implementation
  - Basic upload/download/delete
  - Signed URL generation
  - Local and R2 storage support
  - Complete documentation

---

## 👥 Contributors

This R2 storage integration was built for the Dashboard application to provide secure, scalable file storage.

---

## 📄 License

Part of the Dashboard application. See main project license.

---

**Last Updated**: April 4, 2026

**Status**: ✅ Complete and ready for use

**Recommended Starting Point**: [R2_QUICK_REFERENCE.md](R2_QUICK_REFERENCE.md)
