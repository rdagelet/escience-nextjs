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

**Page Components (`app/admin/blogs/[id]/page.tsx`):
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

---

## 5. Missing LangChain Dependencies (Dec 4, 2024)
**Issue:** Build failed with module not found error for `@langchain/openai`.
```
Module not found: Can't resolve '@langchain/openai'
```
**Root Cause:** The application uses LangChain for knowledge base embeddings functionality, but the required packages were not listed in package.json dependencies.

**Fix:** Added langchain dependencies to `package.json`:
```json
{
  "@langchain/core": "^0.3.36",
  "@langchain/openai": "^0.3.15",
  "langchain": "^0.3.11"
}
```
**Note:** Version compatibility matters - used `@langchain/openai@0.3.15` instead of `1.0.3` due to incompatible peer dependencies.

## 6. Incorrect Import Path in knowledge/route.ts (Dec 4, 2024)
**Issue:** Module not found error for auth route import.
```
Module not found: Can't resolve '../../auth/[...nextauth]/route'
```
**Root Cause:** `app/api/knowledge/route.ts` was using incorrect relative path (`../../auth`) when it should use `../auth`.

**Fix:** Corrected import in `app/api/knowledge/route.ts`:
```diff
-import { authOptions } from '../../auth/[...nextauth]/route';
+import { authOptions } from '../auth/[...nextauth]/route';
```

## 7. Build-Time OpenAI Initialization (Dec 4, 2024)
**Issue:** Build failed during static page generation.
```
OpenAI or Azure OpenAI API key or Token Provider not found
```
**Root Cause:** OpenAI clients were initialized at module level, causing errors during Next.js static page generation when environment variables aren't available.

**Fix:** Implemented lazy initialization in `lib/embeddings.ts` and `app/api/chat/route.ts`:
```typescript
// lib/embeddings.ts
let embeddings: OpenAIEmbeddings | null = null;
function getEmbeddings(): OpenAIEmbeddings {
    if (!embeddings) {
        embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: 'text-embedding-ada-002',
        });
    }
    return embeddings;
}

// app/api/chat/route.ts
export const dynamic = 'force-dynamic';

let openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openai;
}
```

---

## Deployment Status
✅ **All issues resolved** - Last successful deployment: December 4, 2024 (commit `88adc06`)

