# Setting up Vercel KV Database for Blog Posts

Your blog now uses Vercel KV (Redis) for persistent storage across devices and deployments.

## For Local Development

Your app will work locally without any KV setup - it will use fallback default posts. However, posts created locally won't persist to the cloud database until you set up KV credentials.

## For Production (Vercel Deployment)

### 1. Create a Vercel KV Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **KV** (Redis-compatible)
6. Choose a name like `busybat-blog-kv`
7. Select a region (choose the same region as your deployment for best performance)
8. Click **Create**

### 2. Connect KV to Your Project

1. After creating the database, Vercel will show you connection details
2. Click **Connect Project** and select your `busybat` project
3. Vercel will automatically add these environment variables to your project:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 3. Deploy Your Changes

```bash
# Commit and push your changes
git add .
git commit -m "Add Vercel KV database for persistent blog storage"
git push

# Or deploy directly with Vercel CLI
vercel --prod
```

### 4. Verify Setup

1. Visit your deployed site
2. Go to `/blog` to see if posts load
3. Log in and create a test post
4. Check from another device/browser - the post should be visible
5. Check the storage status at `/api/storage-status`

## Features

✅ **Cross-device sync** - Posts created on one device appear on all devices  
✅ **Persistent storage** - Posts survive deployments and restarts  
✅ **Fast performance** - Redis is very fast for read/write operations  
✅ **Generous free tier** - Vercel KV has a good free tier  
✅ **Automatic backups** - Vercel handles backup and maintenance  
✅ **No complex setup** - Much simpler than traditional databases

## Fallback Behavior

- **Local development without KV**: Uses default posts, new posts are lost on restart
- **Production without KV**: Uses default posts, new posts are lost on restart
- **With KV connected**: Full persistence and cross-device sync

## Cost

Vercel KV has a generous free tier:

- 30,000 commands per month
- 256 MB storage
- For a typical blog, this will handle hundreds of posts and thousands of page views

## Migration from File Storage

Your existing posts in `posts.json` won't automatically migrate. You can:

1. **Start fresh** - Let the app create default posts in KV
2. **Manual migration** - Copy your existing posts and re-create them through the admin interface
3. **Automated migration** - Create a one-time migration script (advanced)

The old file-based storage system is still in the codebase but no longer used. You can clean it up later once you're confident the KV system is working.
