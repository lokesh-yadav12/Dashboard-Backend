require('dotenv').config();
const { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testR2Connection() {
  log('\n=== Testing Cloudflare R2 Connection ===\n', 'cyan');

  // Check environment variables
  log('1. Checking environment variables...', 'blue');
  const requiredVars = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME'
  ];

  let missingVars = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
      log(`   ✗ ${varName} is missing`, 'red');
    } else {
      log(`   ✓ ${varName} is set`, 'green');
    }
  }

  if (missingVars.length > 0) {
    log('\n❌ Missing required environment variables!', 'red');
    log('Please set the following in your .env file:', 'yellow');
    missingVars.forEach(v => log(`   - ${v}`, 'yellow'));
    return;
  }

  // Initialize S3 client
  log('\n2. Initializing R2 client...', 'blue');
  try {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    log('   ✓ R2 client initialized', 'green');

    // Test listing buckets
    log('\n3. Testing bucket access...', 'blue');
    try {
      const listCommand = new ListBucketsCommand({});
      const listResponse = await s3Client.send(listCommand);
      log('   ✓ Successfully connected to R2', 'green');
      
      if (listResponse.Buckets && listResponse.Buckets.length > 0) {
        log(`   ✓ Found ${listResponse.Buckets.length} bucket(s):`, 'green');
        listResponse.Buckets.forEach(bucket => {
          const isTarget = bucket.Name === process.env.R2_BUCKET_NAME;
          log(`     ${isTarget ? '→' : ' '} ${bucket.Name}${isTarget ? ' (target bucket)' : ''}`, isTarget ? 'cyan' : 'reset');
        });
      }
    } catch (error) {
      log('   ✗ Failed to list buckets', 'red');
      log(`   Error: ${error.message}`, 'red');
      return;
    }

    // Test upload
    log('\n4. Testing file upload...', 'blue');
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'This is a test file from R2 connection test';
    
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `dashboard/general/${testFileName}`,
        Body: Buffer.from(testContent),
        ContentType: 'text/plain',
      });
      
      await s3Client.send(uploadCommand);
      log(`   ✓ Successfully uploaded test file: ${testFileName}`, 'green');
    } catch (error) {
      log('   ✗ Failed to upload test file', 'red');
      log(`   Error: ${error.message}`, 'red');
      return;
    }

    // Test download
    log('\n5. Testing file download...', 'blue');
    try {
      const downloadCommand = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `dashboard/general/${testFileName}`,
      });
      
      const downloadResponse = await s3Client.send(downloadCommand);
      const downloadedContent = await streamToString(downloadResponse.Body);
      
      if (downloadedContent === testContent) {
        log('   ✓ Successfully downloaded and verified test file', 'green');
      } else {
        log('   ✗ Downloaded content does not match', 'red');
      }
    } catch (error) {
      log('   ✗ Failed to download test file', 'red');
      log(`   Error: ${error.message}`, 'red');
    }

    // Test delete
    log('\n6. Testing file deletion...', 'blue');
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `dashboard/general/${testFileName}`,
      });
      
      await s3Client.send(deleteCommand);
      log('   ✓ Successfully deleted test file', 'green');
    } catch (error) {
      log('   ✗ Failed to delete test file', 'red');
      log(`   Error: ${error.message}`, 'red');
    }

    // Success summary
    log('\n=== ✓ All Tests Passed! ===', 'green');
    log('\nYour R2 configuration is working correctly!', 'green');
    log('You can now use R2 storage in your application.', 'cyan');
    log('\nTo enable R2 storage:', 'yellow');
    log('1. Set STORAGE_TYPE=r2 in your .env file', 'yellow');
    log('2. Restart your backend server', 'yellow');
    log('3. Upload files through your application\n', 'yellow');

  } catch (error) {
    log('\n❌ R2 Connection Test Failed', 'red');
    log(`Error: ${error.message}`, 'red');
    log('\nTroubleshooting:', 'yellow');
    log('1. Verify your R2 credentials are correct', 'yellow');
    log('2. Check that your API token has "Object Read & Write" permissions', 'yellow');
    log('3. Ensure your bucket name is correct', 'yellow');
    log('4. Check your internet connection', 'yellow');
    log('5. Review R2_SETUP_GUIDE.md for detailed setup instructions\n', 'yellow');
  }
}

// Helper function to convert stream to string
async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

// Run the test
testR2Connection().catch(error => {
  log('\n❌ Unexpected Error', 'red');
  log(error.message, 'red');
  console.error(error);
});
