# Render Deployment Issues & Solutions

Comprehensive troubleshooting guide for deploying the eScience Next.js platform to Render.

---

## Issue #1: NextAuth TypeScript Error

**Error:**
```
Type error: Type 'string' is not assignable to type 'SessionStrategy | undefined'.
```

**Location:** `app/api/auth/[...nextauth]/route.ts`

**Cause:** TypeScript couldn't infer the exact type of the string literal `"jwt"`.

**Solution:**
Cast the strategy to a const:
```typescript
session: {
  strategy: "jwt" as const,  // Add 'as const'
}
```

**Commit:** Fixed in initial NextAuth setup

---

## Issue #2: Next.js 16 Dynamic Route Parameters

**Error:**
```
Type error: Property 'id' does not exist on type 'Promise<{ id: string; }>'.
```

**Location:** 
- `app/api/blogs/[id]/route.ts`
- `app/admin/blogs/[id]/page.tsx`
- Similar files for careers, products, etc.

**Cause:** Next.js 16 breaking change - `params` in dynamic routes are now Promises.

**Solution:**

**For API Routes:**
```typescript
// Before
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const blog = await prisma.blogPost.findUnique({ where: { id: params.id } });
}

// After
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;  // Await params first
  const blog = await prisma.blogPost.findUnique({ where: { id } });
}
```

**For Page Components:**
```typescript
// Before
export default function Page({ params }: { params: { id: string } }) {
  return <Editor params={params} />;
}

// After
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);  // Use React.use() to unwrap
  return <Editor params={{ id }} />;
}
```

**Commits:** 
- `fix: Update dynamic route params to be Promises for Next.js 16`

---

## Issue #3: Missing SessionProvider

**Error:**
```
Error occurred prerendering page "/admin/blogs/new".
TypeError: Cannot destructure property 'data' of '(0 , c.useSession)(...)' as it is undefined.
```

**Cause:** `useSession()` hook was used in admin components without wrapping the app in a `SessionProvider`.

**Solution:**

1. Create `components/SessionProvider.tsx`:
```tsx
'use client';

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

2. Wrap root layout in `app/layout.tsx`:
```tsx
<body className={...}>
  <SessionProvider>
    {children}
  </SessionProvider>
</body>
```

**Commit:** `fix: Add SessionProvider to RootLayout to resolve useSession error`

---

## Issue #4: Build Hang / Prisma Client Missing

**Symptoms:**
- Deployment hangs for >10 minutes
- Or fails with "Prisma Client not generated"

**Cause:** 
1. Missing `postinstall` script to generate Prisma Client
2. `@prisma/client` in wrong dependency section

**Solution:**

Update `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"  // Add this
  },
  "dependencies": {
    "@prisma/client": "^5.10.0"  // Move from devDependencies
  }
}
```

**Commit:** `fix: Add postinstall script and move Prisma Client to dependencies`

---

## Issue #5: Missing Body Tag

**Error:**
```
Expected corresponding JSX closing tag for 'html'.
```

**Cause:** Accidentally removed opening `<body>` tag when adding SessionProvider.

**Solution:**
Ensure proper HTML structure:
```tsx
<html lang="en">
  <head>...</head>
  <body className={...}>  {/* Don't forget opening tag! */}
    <SessionProvider>
      {children}
    </SessionProvider>
  </body>
</html>
```

**Commit:** `fix: Restore missing body tag in RootLayout`

---

## Issue #6: Package.json Syntax Error

**Error:**
```
Error: To configure seeding in your project you need to add a "prisma.seed" property...
```

**Cause:** Missing comma in `package.json` after `devDependencies` object.

**Solution:**
```json
{
  "devDependencies": {
    ...
  },  // ← Missing comma here
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

**Commit:** `fix: Fix JSON syntax error in package.json`

---

## Issue #7: ChatLog Field Name Mismatch

**Error:**
```
Type error: Object literal may only specify known properties, and 'userMessage' does not exist...
```

**Cause:** Code used `userMessage`/`botResponse` but Prisma schema defined `userQuery`/`aiResponse`.

**Solution:**

Match field names to schema:
```typescript
// Prisma schema
model ChatLog {
  userQuery   String @db.Text
  aiResponse  String @db.Text
}

// Code must use these exact names
await prisma.chatLog.create({
  data: {
    userQuery: message,    // Not 'userMessage'
    aiResponse: reply,     // Not 'botResponse'
  }
});
```

**Commits:**
- `fix: Correct ChatLog field names to match Prisma schema`
- `fix: Use correct Prisma field names (userQuery/aiResponse)`

---

## Common Deployment Patterns

### ✅ Best Practices

1. **Always check Prisma schema first** when adding database queries
2. **Await params in Next.js 16** dynamic routes
3. **Use SessionProvider** for NextAuth in client components
4. **Add postinstall** scripts for code generation (Prisma, etc.)
5. **Validate JSON syntax** in package.json before committing
6. **Test locally** with `npm run build` before pushing

### ⚠️ Warning Signs

- Build takes >10 minutes = likely Prisma generation issue
- TypeScript errors about Promises = Next.js 16 params issue
- "Cannot destructure" errors = Missing provider/context
- "Property does not exist" = Schema mismatch

---

## Debugging Workflow

When a Render build fails:

1. **Read the error logs carefully**
   - Render shows exact line numbers
   - TypeScript errors are usually descriptive

2. **Check recent changes**
   - What files were modified?
   - Did you update dependencies?
   - Any schema changes?

3. **Test locally first**
   ```bash
   npm run build
   ```
   - If it fails locally, fix before pushing

4. **Common quick fixes**
   - Run `npx prisma generate`
   - Check package.json syntax
   - Verify all imports exist

5. **Push incrementally**
   - Don't bundle 10 changes in one commit
   - Easier to identify which change broke it

---

## Prevention Checklist

Before every deploy:

- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors in IDE
- [ ] `package.json` is valid JSON
- [ ] All environment variables set in Render
- [ ] Prisma schema matches code field names
- [ ] Commits are small and focused

---

## Emergency Rollback

If deployment breaks production:

1. Go to Render Dashboard → Your Service
2. Click "Manual Deploy"
3. Select previous working commit
4. Deploy that version
5. Fix issue locally, test, then redeploy

---

## Version-Specific Notes

### Next.js 16.0.7
- **Breaking:** Dynamic route params are Promises
- **Breaking:** Requires React 19
- Use Turbopack for faster builds

### Prisma 5.10.0
- Downgraded from 7.x for compatibility
- pgvector extension requires manual setup
- Use JSON strings for vectors as workaround

### NextAuth 4.24.13
- Requires SessionProvider wrapper
- Must set NEXTAUTH_SECRET and NEXTAUTH_URL
- Session strategy must be explicitly typed

---

## Additional Resources

- **Next.js 16 Upgrade Guide:** https://nextjs.org/docs/app/building-your-application/upgrading
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment
- **Render Docs:** https://render.com/docs
- **NextAuth Docs:** https://next-auth.js.org/

---

**Last Updated:** December 4, 2025  
**Total Issues Resolved:** 7  
**Average Fix Time:** 10-15 minutes

---

*Keep this document updated as new issues arise!*
