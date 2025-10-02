# Vercel Payload Limit Fix

## Problem
When creating a test with 25 questions, you encountered a "payload error" because Vercel has a **4.5MB payload limit** for serverless functions.

## Solutions Applied

### 1. Increased Express Body Parser Limits
**File: `src/server.ts`**
- Changed `express.json()` to `express.json({ limit: '10mb' })`
- Changed `express.urlencoded({ extended: true })` to `express.urlencoded({ extended: true, limit: '10mb' })`

### 2. Created Vercel Configuration
**File: `vercel.json`** (newly created)
- Set `maxLambdaSize` to 50mb
- Configured function timeout to 30 seconds
- Increased memory to 1024MB

## Important Notes

### Vercel Limits:
- **Request body limit**: 4.5MB (cannot be increased on free/hobby plans)
- **Response body limit**: 4.5MB
- **Function execution timeout**: 10s (hobby), 60s (pro)

### If Issues Persist:

#### Option 1: Batch Upload (Recommended)
Split the test creation into multiple requests:
1. Create the test metadata first
2. Upload questions in batches of 5-10 questions at a time

#### Option 2: Compress Data
- Remove unnecessary whitespace from JSON
- Compress images before uploading (if diagrams are included)
- Use base64 compression for images

#### Option 3: Upgrade Vercel Plan
- Pro plan offers higher limits and priority processing

## Testing
After deploying these changes:
1. Build the project: `npm run build`
2. Deploy to Vercel
3. Try creating a test with 25 questions

## Next Steps if Still Failing
If you still get payload errors with 25 questions:
1. Check if questions contain large diagram images
2. Implement batch upload API endpoint
3. Consider storing images separately in Cloudinary first, then reference URLs
