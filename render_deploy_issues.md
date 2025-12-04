# Render Deployment Issues & Fixes (v1.1.0)

This document tracks the issues encountered during the deployment of the Admin Portal and their solutions.

## 1. NextAuth TypeScript Error
**Issue:** Build failed with type error regarding `session.strategy`.
```typescript
Type 'string' is not assignable to type 'SessionStrategy | undefined'.
```
**Fix:** Explicitly cast the strategy string to a const in `app/api/auth/[...nextauth]/route.ts`.
```typescript
session: {
  strategy: "jwt" as const, // Added 'as const'
}
```

## 2. Next.js 16 Dynamic Route Parameters
**Issue:** Build failed because `params` in dynamic routes are now Promises in Next.js 16.
```typescript
Type error: Property 'id' is missing in type 'Promise<{ id: string; }>'
```
**Fix:** Await the `params` object before accessing properties.

**API Routes (`app/api/blogs/[id]/route.ts`):**
```typescript
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params first
  // ...
}
```

**Page Components (`app/admin/blogs/[id]/page.tsx`):**
```typescript
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Use React.use() to unwrap params
  // ...
}
```

## 3. Missing SessionProvider
**Issue:** Build failed because `useSession` was used in Admin components without a provider context.
```
Error: Cannot destructure property 'data' of '(0 , c.useSession)(...)' as it is undefined.
```
**Fix:**
1. Created `components/SessionProvider.tsx` (Client Component wrapper).
2. Wrapped the app in `app/layout.tsx`:
```tsx
<body className={...}>
  <SessionProvider>
    {children}
  </SessionProvider>
</body>
```

## 4. Build Hang / Prisma Client Missing
**Issue:** Deployment hung for >10 minutes or failed because Prisma Client wasn't generated.
**Fix:** Updated `package.json`:
1. Added `postinstall` script to generate client automatically.
2. Moved `@prisma/client` from `devDependencies` to `dependencies`.

```json
"scripts": {
  "postinstall": "prisma generate"
},
"dependencies": {
  "@prisma/client": "^5.10.0"
}
```
