# Vercel Blob Storage Setup Guide

## Overview

This project now uses Vercel Blob storage for image uploads in production, with local file storage as a fallback for development.

## Setup Instructions

### 1. Create a Vercel Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the "Storage" tab
3. Click "Create Database" and select "Blob"
4. Choose a name for your blob store (e.g., "busybat-images")
5. Select your preferred region
6. Click "Create"

### 2. Get Your Blob Token

1. After creating the blob store, you'll see connection details
2. Copy the `BLOB_READ_WRITE_TOKEN` value
3. This token allows your app to upload, read, and delete files

### 3. Set Environment Variables

#### For Local Development:

1. Open your `.env` file in the project root
2. Replace `your_blob_read_write_token_here` with your actual token:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_1234567890abcdef...
   ```

#### For Vercel Production:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add a new environment variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your blob token
   - **Environments**: Production, Preview (optional)
4. Click "Save"

### 4. Deploy Your Changes

1. Commit and push your changes to your repository
2. Vercel will automatically redeploy with the new blob storage configuration
3. Test image uploads on your deployed site

## How It Works

- **Development**: Images are stored locally in `static/uploads/`
- **Production**: Images are stored in Vercel Blob and served via CDN
- **Automatic Cleanup**: Old images are deleted when posts are updated
- **Fallback**: If blob token is missing, falls back to local storage

## File Size Limits

- Maximum file size: 5MB per image
- Supported formats: All image types (jpg, png, gif, webp, etc.)
- Files are automatically optimized by Vercel's CDN

## Security

- Blob URLs are public but unpredictable
- Only authenticated admin users can upload images
- File type validation prevents non-image uploads
- Size limits prevent abuse

## Troubleshooting

### "Failed to save image" Error

1. Check that `BLOB_READ_WRITE_TOKEN` is set correctly in Vercel
2. Ensure the blob store exists and is active
3. Verify the token has read/write permissions

### Local Development Issues

1. If blob token is not set locally, it will use local file storage
2. Ensure `static/uploads/` directory exists for local development
3. Check file permissions on the uploads directory

### Production Deployment

1. After adding the environment variable, redeploy the site
2. Environment variables are only applied on new deployments
3. Check Vercel function logs for any errors

## Migration from Local Storage

If you had images stored locally before this update:

1. They will continue to work in development
2. New images will use blob storage in production
3. Old local images won't be accessible in production
4. Consider re-uploading important images through the admin panel
