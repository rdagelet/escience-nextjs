# eScience Next.js Platform - Functional Specifications

**Version:** 1.1.0  
**Document Version:** 1.0  
**Last Updated:** December 4, 2025  
**Status:** Production Ready

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Environment & Infrastructure](#environment--infrastructure)
4. [Dependencies](#dependencies)
5. [System Architecture](#system-architecture)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Features & Functionality](#features--functionality)
9. [Configuration Requirements](#configuration-requirements)
10. [Performance Specifications](#performance-specifications)

---

## 1. System Overview

### 1.1 Purpose
Dynamic, database-backed corporate website with comprehensive admin portal for content management and AI-powered customer engagement.

### 1.2 Target Users
- **Public Users:** Potential clients, job seekers, general visitors
- **Administrators:** Content managers, HR team, marketing team
- **System:** AI chatbot for automated customer support

### 1.3 Core Capabilities
- Content management (blogs, products, careers)
- AI chatbot with knowledge base
- User authentication & authorization
- Database-driven dynamic content
- Cloud-first deployment

---

## 2. Tech Stack

### 2.1 Frontend

**Framework:**
- Next.js 16.0.7 (App Router, Turbopack)
- React 19.2.0
- TypeScript 5.x

**UI/Styling:**
- Tailwind CSS 4.x
- Framer Motion 12.23.25 (animations)
- Custom CSS (globals.css)

**Fonts:**
- Montserrat (Google Fonts)

### 2.2 Backend

**Runtime:**
- Node.js 22.16.0 (Render default)

**API:**
- Next.js API Routes (App Router)
- RESTful architecture

**Authentication:**
- NextAuth.js 4.24.13
- JWT-based sessions
- Bcrypt password hashing

### 2.3 Database

**Primary Database:**
- PostgreSQL (Render managed)
- Prisma ORM 5.10.0

**Vector Storage:**
- JSON strings (current)
- pgvector support (optional upgrade)

### 2.4 AI & ML

**Provider:**
- OpenAI Platform

**Models:**
- GPT-3.5-turbo (chat responses)
- text-embedding-ada-002 (vector embeddings)

### 2.5 Hosting & Deployment

**Platform:**
- Render.com (Web Service + PostgreSQL)

**Version Control:**
- Git / GitHub

**CI/CD:**
- Automatic deployment on push to main branch

---

## 3. Environment & Infrastructure

### 3.1 Development Environment

**Prerequisites:**
- Node.js ≥18.x
- npm ≥9.x
- Git
- Code editor (VS Code recommended)

**Local Setup:**
```bash
git clone https://github.com/rdagelet/escience-nextjs
cd escience-nextjs
npm install
# Configure .env (see section 9)
npm run dev
```

**Development URL:**
- http://localhost:3000

### 3.2 Production Environment

**Hosting:**
- Platform: Render.com
- Region: US (configurable)
- Service Type: Web Service
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

**Database:**
- Provider: Render PostgreSQL
- Connection: Internal (via DATABASE_URL)
- Backup: Automatic daily snapshots

**Production URL:**
- https://escience-nextjs.onrender.com

### 3.3 Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Session encryption key
- `NEXTAUTH_URL` - Application URL
- `OPENAI_API_KEY` - OpenAI API access

**Optional:**
- `NODE_ENV` - Environment mode (auto-set by Render)

---

## 4. Dependencies

### 4.1 Production Dependencies

```json
{
  "@prisma/client": "^5.10.0",        // Database ORM client
  "@types/bcryptjs": "^2.4.6",        // TypeScript types for bcrypt
  "bcryptjs": "^3.0.3",               // Password hashing
  "dotenv": "^17.2.3",                // Environment variables
  "framer-motion": "^12.23.25",       // Animation library
  "next": "16.0.7",                   // React framework
  "next-auth": "^4.24.13",            // Authentication
  "openai": "^6.9.1",                 // OpenAI SDK
  "react": "19.2.0",                  // UI library
  "react-dom": "19.2.0"               // React DOM renderer
}
```

### 4.2 Development Dependencies

```json
{
  "@tailwindcss/postcss": "^4",       // Tailwind CSS processor
  "@types/node": "^20",               // Node.js types
  "@types/react": "^19",              // React types
  "@types/react-dom": "^19",          // React DOM types
  "eslint": "^9",                     // Code linting
  "eslint-config-next": "16.0.7",     // Next.js ESLint config
  "prisma": "^5.10.0",                // Database migrations
  "tailwindcss": "^4",                // Utility-first CSS
  "typescript": "^5"                  // TypeScript compiler
}
```

### 4.3 Dependency Notes

**Prisma Version:**
- Using v5.10.0 (downgraded from v7.1.0)
- Reason: Compatibility with current PostgreSQL setup
- Upgrade path: Available when ready

**Next.js Version:**
- Using v16.0.7 with React 19
- Turbopack enabled for faster builds
- Breaking changes documented in DEPLOYMENT_ISSUES.md

---

## 5. System Architecture

### 5.1 Application Structure

```
escience-nextjs/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin portal
│   │   ├── blogs/          # Blog management
│   │   ├── careers/        # Careers management
│   │   ├── chats/          # Chat logs viewer
│   │   ├── knowledge/      # Knowledge base admin
│   │   ├── products/       # Product management
│   │   ├── layout.tsx      # Admin layout with sidebar
│   │   ├── login/          # Admin login
│   │   └── page.tsx        # Admin dashboard
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── blogs/          # Blog CRUD
│   │   ├── careers/        # Careers CRUD
│   │   ├── chat/           # Chatbot endpoint
│   │   ├── chats/          # Chat logs API
│   │   ├── knowledge/      # Knowledge base API
│   │   └── products/       # Products CRUD
│   ├── blog/               # Public blog page
│   ├── careers/            # Public careers page
│   ├── products/           # Public products pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable components
│   ├── admin/              # Admin-specific components
│   │   ├── BlogEditor.tsx
│   │   ├── JobEditor.tsx
│   │   └── ProductEditor.tsx
│   ├── ChatWidget.tsx      # Public chatbot widget
│   └── SessionProvider.tsx # Auth wrapper
├── lib/                    # Utility libraries
│   └── embeddings.ts       # Vector embeddings utils
├── prisma/                 # Database
│   ├── schema.prisma       # Database schema
│   └── seed.js            # Initial data
├── public/                # Static assets
│   └── assets/            # Images, icons
├── documentation/         # Project docs
│   ├── DEPLOYMENT_ISSUES.md
│   ├── HANDOVER.md
│   └── KNOWLEDGE_BASE.md
└── package.json           # Dependencies
```

### 5.2 Data Flow

**Public User Journey:**
```
User → Homepage → Chat Widget → API → OpenAI → Response
                → Blog/Products/Careers → Database → Rendered Content
```

**Admin Journey:**
```
Admin → Login → NextAuth → Dashboard → Manage Content → API → Database → Update
```

**Content Delivery:**
```
Database → Prisma ORM → API Routes → React Components → Client
```

**AI Chat Flow:**
```
User Query → Vector Search → Find Relevant Chunks → OpenAI Context → GPT Response
```

---

## 6. Database Schema

### 6.1 Prisma Schema

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 6.2 Models

#### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  EDITOR
}
```

**Purpose:** Admin authentication  
**Seeded Data:** admin@electronicscience.net (password: admin123)

#### BlogPost
```prisma
model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  excerpt     String
  content     String   @db.Text
  coverImage  String?
  category    String
  published   Boolean  @default(false)
  author      String   @default("eScience Team")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Purpose:** Blog content management  
**Public Access:** `/blog` (published only)  
**Admin Access:** `/admin/blogs`

#### Product
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  features    String[]
  screenshots String[]
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Purpose:** Product catalog  
**Public Access:** `/products`, `/products/[slug]`  
**Admin Access:** `/admin/products`

#### JobOpening
```prisma
model JobOpening {
  id          String   @id @default(cuid())
  title       String
  department  String
  location    String   @default("Manila, Philippines")
  type        String   @default("Full-time")
  description String   @db.Text
  requirements String[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Purpose:** Careers/job postings  
**Public Access:** `/careers` (active only)  
**Admin Access:** `/admin/careers`

#### ChatLog
```prisma
model ChatLog {
  id         String   @id @default(cuid())
  userQuery  String   @db.Text
  aiResponse String   @db.Text
  sentiment  String?
  createdAt  DateTime @default(now())
}
```

**Purpose:** Chat history tracking  
**Admin Access:** `/admin/chats` (view only)

#### KnowledgeChunk
```prisma
model KnowledgeChunk {
  id        String   @id @default(cuid())
  content   String   @db.Text
  embedding String?  @db.Text // JSON array of 1536 floats
  metadata  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([createdAt])
}
```

**Purpose:** Vector embeddings storage  
**Admin Access:** `/admin/knowledge`

#### Testimonial
```prisma
model Testimonial {
  id        String   @id @default(cuid())
  name      String
  title     String
  company   String
  quote     String   @db.Text
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Purpose:** Customer testimonials (future feature)  
**Status:** Schema defined, UI not implemented

---

## 7. API Endpoints

### 7.1 Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/[...nextauth]` | Public | NextAuth handlers (signin, signout, session) |

### 7.2 Blogs

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/blogs` | Public | List all published blogs |
| POST | `/api/blogs` | Admin | Create new blog |
| GET | `/api/blogs/[id]` | Public | Get single blog |
| PUT | `/api/blogs/[id]` | Admin | Update blog |
| DELETE | `/api/blogs/[id]` | Admin | Delete blog |

### 7.3 Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | List all products |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/products/[id]` | Public | Get single product |
| PUT | `/api/products/[id]` | Admin | Update product |
| DELETE | `/api/products/[id]` | Admin | Delete product |

### 7.4 Careers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/careers` | Public | List all job openings |
| POST | `/api/careers` | Admin | Create job posting |
| GET | `/api/careers/[id]` | Public | Get single job |
| PUT | `/api/careers/[id]` | Admin | Update job |
| DELETE | `/api/careers/[id]` | Admin | Delete job |

### 7.5 Chat & Knowledge

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/chat` | Public | Send chat message, get AI response |
| GET | `/api/chats` | Admin | List all chat logs |
| GET | `/api/knowledge` | Admin | List knowledge chunks |
| POST | `/api/knowledge/upload` | Admin | Upload & embed knowledge |
| DELETE | `/api/knowledge` | Admin | Delete knowledge chunk |

---

## 8. Features & Functionality

### 8.1 Public Features

**Homepage**
- Hero section with animations
- Services overview
- Statistics counter
- Client logos
- Contact information
- AI chat widget (bottom-right)

**Blog (`/blog`)**
- List view with categories
- Search/filter by category
- Dynamic routing to posts
- Newsletter signup (UI only)

**Products (`/products`, `/products/[slug]`)**
- Product catalog grid
- Dynamic product detail pages
- Screenshot carousel
- Feature lists
- "Request Demo" CTA

**Careers (`/careers`)**
- Active job listings
- Filter by department/type
- Job requirements display
- "Apply Now" email link

**AI Chatbot**
- Real-time chat interface
- Knowledge base integration
- Conversation history
- Typing indicators

### 8.2 Admin Features

**Dashboard (`/admin`)**
- Quick stats overview
- Recent activity
- Quick action buttons

**Blog Management (`/admin/blogs`)**
- List all blogs (published and draft)
- Create/edit/delete posts
- Rich text editor
- Category management
- Publish toggle

**Product Management (`/admin/products`)**
- Product catalog management
- Feature lists (dynamic add/remove)
- Screenshot URLs
- Display order control

**Careers Management (`/admin/careers`)**
- Job posting CRUD
- Requirements list editor
- Active/closed status toggle
- Department/type selection

**Knowledge Base (`/admin/knowledge`)**
- Upload text documentation
- Auto-chunking (500 words)
- Vector embedding generation
- View/delete chunks
- Source tracking

**Chat Logs (`/admin/chats`)**
- View all conversations
- User queries and AI responses
- Timestamp sorting
- Read-only access

**Authentication**
- Email/password login
- Session management
- Automatic redirect protection
- Sign out functionality

---

## 9. Configuration Requirements

### 9.1 Environment Variables

**Development (.env):**
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/escience"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
```

**Production (Render):**
- Set via Render Dashboard → Environment
- Same variables as development
- NEXTAUTH_URL should be production URL

### 9.2 Database Setup

**Initial Setup:**
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npx prisma db seed
```

**Migrations:**
```bash
# Create migration
npx prisma migrate dev --name description

# Deploy to production
npx prisma migrate deploy
```

### 9.3 Build Configuration

**package.json scripts:**
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "postinstall": "prisma generate"
}
```

---

## 10. Performance Specifications

### 10.1 Response Times

**Target Metrics:**
- Homepage load: <2s
- Admin dashboard: <1s
- API responses: <500ms
- Chat responses: 1-3s (depends on OpenAI)
- Vector search: <500ms (<1000 chunks)

### 10.2 Scalability

**Current Capacity:**
- Concurrent users: ~100
- Database records: ~10,000 per model
- Knowledge chunks: ~1,000 (JSON storage)
- Chat messages: ~10,000/month

**Upgrade Paths:**
- pgvector: 10,000+ knowledge chunks
- Prisma Accelerate: Connection pooling
- Render scale-up: More CPU/RAM

### 10.3 Browser Support

**Supported Browsers:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)

**Mobile Support:**
- iOS Safari 14+
- Chrome Android (latest)

### 10.4 Accessibility

**Standards:**
- Semantic HTML
- ARIA labels (where needed)
- Keyboard navigation
- Color contrast compliance

---

## Appendices

### A. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2025 | Initial static site |
| 1.1.0 | Dec 2025 | Dynamic platform with admin portal, AI, vector embeddings |

### B. Future Enhancements

**Planned:**
- Email reports (daily summaries)
- Testimonials management
- File upload for knowledge base
- Multi-user admin roles
- Analytics dashboard

**Considered:**
- Image upload/CDN integration
- Advanced search
- Multi-language support

### C. Related Documentation

- `HANDOVER.md` - Setup and maintenance guide
- `DEPLOYMENT_ISSUES.md` - Troubleshooting
- `KNOWLEDGE_BASE.md` - Vector embeddings guide

---

**Document Control:**
- **Author:** Development Team
- **Approved By:** [Pending]
- **Next Review:** [As needed]
- **Distribution:** Internal

---

*End of Functional Specifications*
