# File Upload Setup Instructions

## Installation

Run this command in the `Dashboard backend` directory to install the required package:

```bash
npm install express-fileupload
```

## What's Been Added

### 1. Backend Changes

- **Upload Controller** (`src/controllers/uploadController.js`): Handles file uploads, downloads, viewing, and deletion
- **Upload Routes** (`src/routes/upload.js`): API endpoints for file operations
- **Server Configuration** (`src/server.js`): Added express-fileupload middleware and static file serving

### 2. Frontend Changes

- **API Service** (`src/services/api.ts`): Added uploadAPI with methods for file operations
- **TeamMemberDetails**: Now uploads profile images and qualification documents to server
- **ClientDetails**: Now uploads invoice documents to server
- **PaymentHistory**: Opens actual uploaded invoice documents

### 3. File Upload Endpoints

- `POST /api/upload` - Upload a file
- `GET /api/upload/view/:type/:filename` - View/open a file
- `GET /api/upload/download/:type/:filename` - Download a file
- `DELETE /api/upload/:type/:filename` - Delete a file

### 4. Upload Types

- `profileImage` - Team member profile pictures
- `qualificationDocument` - Team member qualification certificates
- `invoiceDocument` - Payment invoices
- `general` - Other documents

## How It Works

1. **Upload**: When you upload a file (profile image, qualification doc, or invoice), it's sent to the backend
2. **Storage**: Files are stored in `Dashboard backend/uploads/{type}/` directory
3. **Database**: Only the filename is stored in MongoDB
4. **Retrieval**: When viewing/downloading, the backend serves the file from the uploads directory

## File Structure

```
Dashboard backend/
├── uploads/
│   ├── profileImage/
│   ├── qualificationDocument/
│   └── invoiceDocument/
├── src/
│   ├── controllers/
│   │   └── uploadController.js
│   └── routes/
│       └── upload.js
```

## Usage

### Upload Profile Image
1. Go to Team Member Details
2. Click Edit
3. Select a profile image file
4. Save - the image will be uploaded to the server

### Upload Qualification Document
1. Go to Team Member Details
2. Click Edit
3. Select a qualification document
4. Save - the document will be uploaded

### View Qualification Document
1. Go to Team Member Details
2. Click on the qualification document link
3. The document will open in a new tab

### Upload Invoice
1. Go to Client Details
2. Click "Add Payment"
3. Upload invoice document (required)
4. Submit - the invoice will be uploaded

### View Invoice
1. Go to Payment History
2. Click "View Invoice" button
3. The invoice will open in a new tab

## Security

- Maximum file size: 5MB
- Authentication required for all file operations
- Files are stored with unique timestamps to prevent conflicts
- Only authenticated users can access their uploaded files

## Next Steps

After running `npm install express-fileupload`, restart your backend server:

```bash
npm run dev
```

The file upload functionality will now be fully operational!
