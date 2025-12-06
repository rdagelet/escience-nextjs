# Homepage CMS Implementation Plan

**Created:** December 6, 2025
**Status:** Ready for Implementation
**Priority:** High

---

## Overview

Implement admin CMS capabilities for all hardcoded homepage sections, similar to the existing Blog/Product/Career management system.

**Current State:** All homepage content is hardcoded in `app/page.tsx` (499 lines)
**Goal:** Move all content to database with admin management interface

---

## Sections Requiring CMS

### 1. ✅ Testimonials ("What Our Customers Say")
**Priority:** HIGHEST - Model already exists!
**Current:** 4 hardcoded testimonials (lines 347-409)
**Prisma Model:** `Testimonial` - Already defined but not wired up

**Existing Schema:**
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

**Current Testimonials:**
- Andy Gapuz (MIS Manager, Manila Doctors Hospital)
- Neville F. Sisgado (Executive VP & CIO, Jollibee Foods Corp)
- Caroline Junsay (President & CEO, Shakey's Pizza Asia Ventures Inc.)
- Julie Anne Catalan-Kempis (AVP Head of Commercial Banking Group, BPI)

**Implementation Needed:**
- [ ] API routes: `/api/testimonials/route.ts` (GET, POST)
- [ ] API routes: `/api/testimonials/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Admin list page: `/app/admin/testimonials/page.tsx`
- [ ] Admin create page: `/app/admin/testimonials/new/page.tsx`
- [ ] Admin edit page: `/app/admin/testimonials/[id]/page.tsx`
- [ ] Editor component: `/components/admin/TestimonialEditor.tsx`
- [ ] Update homepage: Fetch from API instead of hardcoded
- [ ] Update admin nav: Add "Testimonials" to sidebar

**Estimated Time:** 1-2 hours

---

### 2. 🔧 Solutions ("What We Do")
**Priority:** HIGH
**Current:** 6 hardcoded solution cards (lines 273-315)

**Current Solutions:**
1. CRM Tools for Salesforce
2. Inventory Management
3. Paperless Operations
4. Mobile POS Solutions
5. Brand Loyalty Systems
6. Custom Solutions

**Two Implementation Options:**

#### Option A: Extend Existing Products (RECOMMENDED)
**Pros:** Reuses existing infrastructure, no new models needed
**Cons:** Mixing homepage and products page data

**Changes:**
- Add `displayOnHomepage: Boolean @default(false)` to Product model
- Add `icon: String?` to Product model (for solution icons)
- Update ProductEditor with "Display on Homepage" checkbox
- Update homepage to fetch `products.filter(p => p.displayOnHomepage)`

**Files to Modify:**
- `prisma/schema.prisma` (add fields)
- `components/admin/ProductEditor.tsx` (add checkbox + icon input)
- `app/page.tsx` (fetch from API)

#### Option B: Create New "Service" Model
**Pros:** Clean separation, dedicated admin section
**Cons:** More work, duplicates infrastructure

**New Model:**
```prisma
model Service {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  icon        String   // e.g., "Code", "Package", "Smartphone"
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Implementation Needed:**
- Complete CRUD (API + Admin pages + Editor component)

**Recommendation:** Start with **Option A**, migrate to Option B later if needed

**Estimated Time:** 2-3 hours (Option A) or 4-5 hours (Option B)

---

### 3. 🎯 Why eScience Features
**Priority:** HIGH
**Current:** 4 hardcoded feature cards (lines 317-345)

**Current Features:**
1. Proven Track Record (01)
2. Award-Winning Solutions (02)
3. Mobile Technology Pioneers (03)
4. Trusted Worldwide (04)

**New Model Required:**
```prisma
model WhyFeature {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  order       Int      @default(0)
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Implementation Needed:**
- [ ] Prisma migration
- [ ] API routes: `/api/why-features/route.ts` + `[id]/route.ts`
- [ ] Admin pages: `/app/admin/why-features/`
- [ ] Editor component: `/components/admin/WhyFeatureEditor.tsx`
- [ ] Update homepage: Fetch from API
- [ ] Update admin nav

**Estimated Time:** 3-4 hours

---

### 4. 📊 Stats Section
**Priority:** MEDIUM
**Current:** 4 hardcoded stats (lines 202-224)

**Current Stats:**
- 24 Years of Innovation
- 100 Clients Worldwide
- 100% Uptime Since 2000
- AWS Partner Nominee 2018

**New Model Required:**
```prisma
model HomeStat {
  id        String   @id @default(cuid())
  label     String
  value     String   // "24", "100", "100%"
  suffix    String?  // "Years", "Clients", null
  order     Int      @default(0)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Implementation Needed:**
- Complete CRUD infrastructure

**Estimated Time:** 2-3 hours

---

### 5. 🏢 Client Logos
**Priority:** LOW
**Current:** 5 placeholder names (lines 226-239)

**New Model Required:**
```prisma
model ClientLogo {
  id        String   @id @default(cuid())
  name      String
  logo      String   // Cloudinary URL
  url       String?  // Client website
  order     Int      @default(0)
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Special Requirement:** Use ImageUploader component for logo upload

**Estimated Time:** 2-3 hours

---

## Implementation Roadmap

### 🚀 Phase 1: Quick Win (Session 1 - 1-2 hours)
**Goal:** Get testimonials working end-to-end

✅ **Testimonials Implementation:**
1. Create API routes for testimonials
2. Create admin list page
3. Create admin editor component
4. Update admin navigation
5. Update homepage to fetch testimonials
6. Test complete flow
7. Migrate existing 4 testimonials to database

**Deliverable:** Fully functional testimonials admin + live homepage display

---

### 🎯 Phase 2: Core Content (Session 2 - 3-4 hours)
**Goal:** Why eScience and Stats sections

**Why eScience Implementation:**
1. Add Prisma model + migration
2. Create API routes
3. Create admin pages + editor
4. Update homepage
5. Seed with existing 4 features

**Stats Implementation:**
1. Add Prisma model + migration
2. Create API routes
3. Create admin pages + editor
4. Update homepage
5. Seed with existing 4 stats

**Deliverable:** 3 sections managed via CMS

---

### 💼 Phase 3: Solutions Integration (Session 3 - 2-3 hours)
**Goal:** Solutions/Services section

**Option A Implementation (Recommended):**
1. Extend Product model
2. Update ProductEditor
3. Update homepage logic
4. Migrate existing 6 solutions

**Deliverable:** All main homepage sections in CMS

---

### 🎨 Phase 4: Polish (Optional - 1-2 hours)
**Goal:** Client logos + refinements

1. Client Logos implementation
2. Add reordering capability (drag-and-drop)
3. Add bulk enable/disable
4. Homepage section visibility toggles

---

## File Structure Reference

### Current Files
```
app/
├── page.tsx (HOMEPAGE - All content hardcoded here)
├── admin/
│   ├── layout.tsx (NAVIGATION - Update with new sections)
│   ├── blogs/ ✅
│   ├── products/ ✅
│   ├── careers/ ✅
│   └── testimonials/ ❌ (TO CREATE)
└── api/
    ├── blogs/ ✅
    ├── products/ ✅
    ├── careers/ ✅
    └── testimonials/ ❌ (TO CREATE)

components/admin/
├── BlogEditor.tsx ✅
├── ProductEditor.tsx ✅
├── JobEditor.tsx ✅
├── TestimonialEditor.tsx ❌ (TO CREATE)
├── ImageUploader.tsx ✅ (REUSE)
└── MultiImageUploader.tsx ✅ (REUSE)

prisma/
└── schema.prisma (Testimonial model exists, others to add)
```

### Files to Create (Phase 1 - Testimonials)

**API Routes:**
1. `app/api/testimonials/route.ts` (~80 lines)
2. `app/api/testimonials/[id]/route.ts` (~120 lines)

**Admin Pages:**
3. `app/admin/testimonials/page.tsx` (~150 lines)
4. `app/admin/testimonials/new/page.tsx` (~10 lines)
5. `app/admin/testimonials/[id]/page.tsx` (~10 lines)

**Components:**
6. `components/admin/TestimonialEditor.tsx` (~180 lines)

**Files to Modify:**
7. `app/admin/layout.tsx` (add navigation item)
8. `app/page.tsx` (replace hardcoded testimonials with fetch)

---

## Code Templates

### Template 1: API Route Pattern
```typescript
// app/api/testimonials/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

// GET - Public (fetch all)
export async function GET() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(testimonials);
}

// POST - Protected (create)
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, title, company, quote, avatar } = await request.json();

    const testimonial = await prisma.testimonial.create({
        data: { name, title, company, quote, avatar },
    });

    return NextResponse.json(testimonial);
}
```

### Template 2: Admin List Page Pattern
```typescript
// app/admin/testimonials/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        fetch('/api/testimonials')
            .then(res => res.json())
            .then(data => setTestimonials(data));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial?')) return;

        await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        setTestimonials(testimonials.filter(t => t.id !== id));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Testimonials</h1>
                <Link href="/admin/testimonials/new">
                    <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-lg">
                        Add New
                    </button>
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="text-left p-4 text-gray-400">Name</th>
                            <th className="text-left p-4 text-gray-400">Company</th>
                            <th className="text-left p-4 text-gray-400">Quote</th>
                            <th className="text-right p-4 text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonials.map((t) => (
                            <tr key={t.id} className="border-t border-white/10">
                                <td className="p-4 text-white">{t.name}</td>
                                <td className="p-4 text-gray-400">{t.company}</td>
                                <td className="p-4 text-gray-400">{t.quote.substring(0, 60)}...</td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/testimonials/${t.id}`}>
                                        <button className="text-teal-500 hover:text-teal-400 mr-4">Edit</button>
                                    </Link>
                                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-400">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
```

### Template 3: Editor Component Pattern
```typescript
// components/admin/TestimonialEditor.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageUploader from './ImageUploader';

export default function TestimonialEditor({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isNew = !params?.id;
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        company: '',
        quote: '',
        avatar: '',
    });

    useEffect(() => {
        if (!isNew && params?.id) {
            fetch(`/api/testimonials/${params.id}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData(data);
                    setLoading(false);
                });
        }
    }, [isNew, params?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const url = isNew ? '/api/testimonials' : `/api/testimonials/${params?.id}`;
        const method = isNew ? 'POST' : 'PUT';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/admin/testimonials');
            router.refresh();
        }
        setSaving(false);
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
                {isNew ? 'Add Testimonial' : 'Edit Testimonial'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Company</label>
                        <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm mb-2">Quote</label>
                        <textarea
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-32"
                            required
                        />
                    </div>

                    <ImageUploader
                        value={formData.avatar}
                        onChange={(url) => setFormData({ ...formData, avatar: url })}
                        label="Avatar Image"
                        folder="electronicscience/testimonials"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-3 rounded-lg"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <Link href="/admin/testimonials">
                        <button type="button" className="text-gray-400 hover:text-white px-8 py-3">
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
```

---

## Testing Checklist

### Phase 1 - Testimonials:
- [ ] Can create new testimonial
- [ ] Can upload avatar image
- [ ] Can edit existing testimonial
- [ ] Can delete testimonial
- [ ] Homepage displays testimonials from database
- [ ] Navigation shows "Testimonials" link
- [ ] Only admins can create/edit/delete

---

## Next Session Startup Commands

```bash
# Navigate to project
cd /Users/rickydagelet/.gemini/antigravity/scratch/electronicscience-redesign/electronicscience-next

# Read this plan
cat documentation/HOMEPAGE_CMS_PLAN.md

# Start dev server
npm run dev

# Open in browser
# http://localhost:3000
# http://localhost:3000/admin
```

---

## Success Criteria

**Phase 1 Complete When:**
- ✅ Testimonials fully managed via admin portal
- ✅ Homepage pulls testimonials from database
- ✅ All 4 existing testimonials migrated
- ✅ Can add/edit/delete with image upload
- ✅ Code follows existing patterns exactly

---

**Ready for implementation!** Start with Phase 1 (Testimonials) in the next session.
