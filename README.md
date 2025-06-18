# Busy Little Bat Sewing

<img src="/static/photos/small-final.webp" alt="busy little bat sewing" width="600">

## The official website

## Admin Blog System

This project now includes a complete admin blog system that allows an administrator to log in and manage blog posts without needing to know how to code.

## Features

### For Administrators

- **Secure Login**: Admin can log in with username/password
- **Create Posts**: Write new blog posts with a simple form
- **Edit Posts**: Modify existing blog posts
- **Delete Posts**: Remove blog posts with confirmation
- **User-Friendly Interface**: Clean, modern interface that's easy to use

### For Visitors

- **Public Blog**: Anyone can view published blog posts at `/blog`
- **Responsive Design**: Blog looks great on all devices
- **Clean Layout**: Easy-to-read blog post cards with publication dates

## How to Use

### Admin Access

1. Navigate to `/login`
2. Use the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Once logged in, you'll be redirected to `/admin`
4. From the admin dashboard, you can:
   - Create new blog posts using the form at the top
   - View all existing posts
   - Edit any post by clicking the "Edit" button
   - Delete posts by clicking the "Delete" button (with confirmation)
   - Logout when finished

### Public Blog

- Visitors can view all published blog posts at `/blog`
- Posts are displayed in a clean, card-based layout
- No login required for viewing

## Technical Details

### Pages Created/Updated

- `/login` - Admin login page
- `/admin` - Admin dashboard for managing posts
- `/blog` - Public blog page for viewing posts
- Navigation updated to include blog link

### API Endpoints

- `POST /api/login` - Admin authentication
- `POST /api/logout` - Admin logout
- `GET /api/posts` - Fetch all blog posts
- `POST /api/posts/create` - Create new blog post (admin only)
- `POST /api/posts/edit/[id]` - Update existing post (admin only)
- `POST /api/posts/delete/[id]` - Delete post (admin only)

### Data Storage

- Blog posts are stored in `src/lib/data/posts.json`
- Each post includes: ID, title, content, creation date, and update date
- File-based storage makes it simple and doesn't require a database

### Security

- JWT tokens for admin authentication
- Password hashing with bcrypt
- Protected admin routes
- Session timeout after 1 hour

## Customization

### Changing Admin Credentials

Edit `src/lib/data/auth.js` and modify the credentials in the `authenticate` function.

### Styling

- Admin pages: Styles are in the respective `.svelte` files
- Blog page: Responsive design with hover effects and clean typography

### Adding Features

The system is built with Svelte 5 and uses modern patterns like runes for state management. You can easily extend it by:

- Adding rich text editing
- Adding image uploads
- Adding categories or tags
- Adding post drafts vs published status

## Sample Posts

The system comes with two sample blog posts to demonstrate the functionality. You can delete these and add your own content through the admin interface.
