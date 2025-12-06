# eScience Next.js Platform - Complete Handover Guide

**Version:** 1.2.0  
**Live URL:** https://escience-nextjs.onrender.com/  
**GitHub:** https://github.com/rdagelet/escience-nextjs  
**Last Updated:** December 6, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Admin Access](#admin-access)
3. [Environment Variables](#environment-variables)
4. [Features & Capabilities](#features--capabilities)
5. [Database Schema](#database-schema)
6. [Content Management](#content-management)
7. [Deployment Workflow](#deployment-workflow)
8. [Maintenance & Updates](#maintenance--updates)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

The eScience website has been transformed from a static site into a **dynamic, database-backed Next.js 16 application** with a full Admin Portal for content management.

### Tech Stack

- **Framework:** Next.js 16.0.7 (with Turbopack)
- **UI:** React 19.2.0, Tailwind CSS 4, Framer Motion
- **Database:** PostgreSQL (hosted on Render)
- **ORM:** Prisma 5.10.0
- **Authentication:** NextAuth.js v4
- **AI:** OpenAI GPT-3.5-turbo
- **Hosting:** Render (cloud platform)

### Key Improvements

✅ **Admin Portal** - Manage all content without code changes  
✅ **Database-Driven** - All content stored in PostgreSQL  
✅ **Real AI Chatbot** - Powered by OpenAI  
✅ **Modern Animations** - Framer Motion for smooth UX  
✅ **Cloud-First** - Auto-deploy on GitHub push  
✅ **AI-Driven Messaging** - Positioned as enterprise transformation partner (v1.2.0)  
✅ **Global Navigation** - Clickable logo and consistent nav on all pages (v1.2.0)  

---

## 🔐 Admin Access

### Login Credentials

**Admin Portal URL:** `https://escience-nextjs.onrender.com/admin/login`

```
Email: admin@electronicscience.net
Password: admin123
```

> ⚠️ **IMPORTANT:** Change this password immediately after first login by updating the database or creating a new admin user.

### First-Time Setup

After deployment, you must **seed the database** to create the admin user:

1. Go to **Render Dashboard** → Your Web Service → **Shell**
2. Run: `npx prisma db seed`
3. Confirm you see: `{ user: { ... } }`

---

## 🔑 Environment Variables

These must be set in **Render Dashboard** → Environment:

### Required Variables

```bash
# Database (Provided by Render PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/database

# Authentication (Generate a secure secret)
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars
NEXTAUTH_URL=https://escience-nextjs.onrender.com

# AI Chatbot (Get from OpenAI Platform)
OPENAI_API_KEY=sk-...
```

### How to Get API Keys

**NEXTAUTH_SECRET:**
```bash
# Generate locally:
openssl rand -base64 32
```

**OPENAI_API_KEY:**
- Go to: https://platform.openai.com/api-keys
- Create new secret key
- Copy and save (it won't be shown again)

---

## ✨ Features & Capabilities

### 1. Blog Management (`/admin/blogs`)

**Public Page:** `/blog`  
**Admin Features:**
- Create, edit, delete blog posts
- Set published status (draft/live)
- Add cover images (URL)
- Categorize posts
- Rich text content

**Usage:**
1. Go to Admin → Blogs → + New Post
2. Fill in title, excerpt, content
3. Choose category and add cover image URL
4. Toggle "Published" to make live
5. Save

### 2. Careers Management (`/admin/careers`)

**Public Page:** `/careers`  
**Admin Features:**
- Post job openings
- Set department, location, type
- Add job requirements (list format)
- Toggle active/closed status

**Usage:**
1. Admin → Careers → + Post Job
2. Fill job details and requirements
3. Set as "Active" to display publicly
4. Published jobs show on `/careers` with "Apply Now" button

### 3. Product Management (`/admin/products`)

**Public Pages:** `/products` (list) and `/products/[slug]` (detail)  
**Admin Features:**
- Manage product catalog
- Add features and screenshots (URLs)
- Set display order
- Auto-generate URL slugs

**Usage:**
1. Admin → Products → + Add Product
2. Enter name, description
3. Add features (one per line)
4. Add screenshot URLs
5. Set display order (lower = higher priority)

### 4. Chat Logs (`/admin/chats`)

**View Only**  
**Features:**
- See all chatbot conversations
- User queries and AI responses
- Timestamps

> 💡 Chat logs populate automatically when visitors use the chatbot on the main site.

### 5. AI Chatbot (Public Site)

**Location:** Bottom-right corner of all public pages  
**Powered By:** OpenAI GPT-3.5-turbo  
**Training:** Pre-programmed with eScience knowledge

**How It Works:**
- User asks question → saved to database
- OpenAI generates response → saved to database
- Admin can review all chats in `/admin/chats`

---

## 🗄️ Database Schema

### Models

```prisma
User          # Admin accounts
BlogPost      # Blog articles
Product       # Product catalog
JobOpening    # Career listings
Testimonial   # Customer reviews (future)
ChatLog       # AI chatbot history
```

### Accessing Database

**Via Render:**
1. Dashboard → PostgreSQL → Connect
2. Use connection string in `DATABASE_URL`

**Via Prisma Studio (Local):**
```bash
npx prisma studio
```

---

## 📝 Content Management

### Adding a Blog Post

1. **Login:** `/admin/login`
2. **Navigate:** Blogs → + New Post
3. **Write:**
   - Title: "5 Ways Mobile Apps Boost Sales"
   - Excerpt: Short summary (2-3 lines)
   - Category: Choose from dropdown
   - Cover Image: `https://your-image-url.com/image.jpg`
   - Content: Full blog text (supports line breaks)
4. **Publish:** Check "Published" → Save
5. **Verify:** Visit `/blog` to see live

### Adding a Product

1. **Login:** `/admin/login`
2. **Navigate:** Products → + Add Product
3. **Details:**
   - Name: "PocketWiSE"
   - Description: Product overview
4. **Add Features:**
   - Type feature → Click "Add"
   - Repeat for each feature
5. **Add Screenshots:**
   - Paste image URL → Click "Add"
   - First image = hero image
6. **Order:** Set display priority (0 = first)
7. **Save**
8. **Verify:** Visit `/products` to see card

### Posting a Job

1. **Login:** `/admin/login`
2. **Navigate:** Careers → + Post Job
3. **Fill Form:**
   - Title: "Senior React Developer"
   - Department: Engineering
   - Location: Manila, Philippines
   - Type: Full-time
   - Description: Job overview
4. **Requirements:**
   - Type requirement → Click "Add"
   - Repeat for all requirements
5. **Active:** Check to display publicly
6. **Save**
7. **Verify:** Visit `/careers` to see listing

---

## 🚀 Deployment Workflow

### Automatic Deployment

**Trigger:** Every time you push to GitHub `main` branch

```bash
git add .
git commit -m "Update: added new blog post"
git push
```

Render will:
1. Detect the push
2. Pull latest code
3. Run `npm install`
4. Run `npx prisma generate` (auto)
5. Build Next.js app
6. Deploy to production

**Build Time:** ~3-5 minutes

### Manual Deployment

Render Dashboard → Web Service → Manual Deploy → Deploy latest commit

---

## 🛠️ Maintenance & Updates

### Updating Content

**✅ DO:** Use Admin Portal (recommended)  
**❌ DON'T:** Edit database directly

### Updating Code

For developers:

1. Clone repository locally
2. Install dependencies: `npm install`
3. Set up `.env` file (copy from Render)
4. Run locally: `npm run dev`
5. Make changes
6. Test thoroughly
7. Commit and push to GitHub

### Updating Dependencies

```bash
# Check outdated packages
npm outdated

# Update safely (test after!)
npm update
```

> ⚠️ **Warning:** Next.js 16 is new. Avoid major version updates without testing.

### Database Migrations

If you change the Prisma schema:

```bash
# Create migration
npx prisma migrate dev --name describe_your_change

# Update production (via Render Shell)
npx prisma migrate deploy
```

---

## 🔧 Troubleshooting

### Build Fails on Render

**Check:**
1. Render logs for specific error
2. `package.json` syntax (no trailing commas)
3. TypeScript errors (type mismatches)
4. Environment variables are set

**Common Fixes:**
- See `render_deploy_issues.md` in repo
- Ensure `prisma generate` runs in `postinstall`

### Admin Login Not Working

**Solutions:**
1. Verify database was seeded: `npx prisma db seed`
2. Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Render
3. Clear browser cookies
4. Try incognito mode

### Chatbot Not Responding

**Checklist:**
- [ ] `OPENAI_API_KEY` is set in Render
- [ ] API key is valid (check OpenAI dashboard)
- [ ] You have credits in OpenAI account
- [ ] Check browser console for errors

### Database Connection Issues

**Solutions:**
1. Verify `DATABASE_URL` in Render environment
2. Check PostgreSQL service is running
3. Restart web service

### Content Not Showing on Public Pages

**Checklist:**
- [ ] Content is marked as "Published" or "Active"
- [ ] Cache cleared (hard refresh: Cmd+Shift+R)
- [ ] No build errors in Render logs

---

## 📞 Support Resources

### Documentation

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Render:** https://render.com/docs
- **OpenAI:** https://platform.openai.com/docs

### Key Files in Repository

- `README.md` - Project setup
- `render_deploy_issues.md` - Deployment troubleshooting
- `prisma/schema.prisma` - Database structure
- `package.json` - Dependencies

### Getting Help

1. Check Render logs first (most issues show there)
2. Review this handover guide
3. Search error messages in documentation
4. Contact your development team

---

## 🎉 Next Steps

### Immediate Actions

1. ✅ Seed database (if not done): `npx prisma db seed`
2. ✅ Add `OPENAI_API_KEY` to Render
3. ✅ Change admin password
4. ✅ Add first blog post to test
5. ✅ Post 1-2 real job openings
6. ✅ Add your actual products

### Future Enhancements

Planned but not implemented:
- [ ] Email Reports (daily summaries)
- [ ] Testimonials Management
- [ ] Image Upload (currently URLs only)
- [ ] Analytics Dashboard
- [ ] Multi-user Admin accounts

---

## 📊 Project Statistics

**Lines of Code:** ~5,000+  
**Components:** 20+  
**API Routes:** 15+  
**Database Models:** 6  
**Admin Pages:** 8  
**Public Pages:** 7+  

**Development Time:** ~8 hours  
**Build Issues Fixed:** 5  
**Production Ready:** ✅ Yes

---

**End of Handover Guide**

For questions or issues, refer to the repository documentation or contact your development team.
