# Vector Embeddings Knowledge Base - Setup Guide

## ✅ What Was Implemented

A complete vector embeddings system for semantic search in the AI chatbot:

- **Database Model:** `KnowledgeChunk` table for storing text + embeddings
- **Admin UI:** `/admin/knowledge` - Upload and manage knowledge base
- **Vector Search:** Automatic semantic search when users ask questions
- **Smart Chunking:** Text auto-split into ~500 word chunks
- **OpenAI Embeddings:** Uses `text-embedding-ada-002` model

---

## 🚀 How to Use

### Step 1: Upload Knowledge

1. Login to Admin Portal: `/admin/login`
2. Go to **Knowledge Base** (in sidebar)
3. Paste your documentation (product guides, FAQs, etc.)
4. Optional: Add source name
5. Click **Upload Knowledge**

The system will:
- Split text into chunks
- Generate embeddings (vectors)
- Store in database

### Step 2: Test the Chatbot

Go to the public site and ask questions like:
- "What products do you offer?"
- "How much does PocketWiSE cost?"
- "What are the features of 1-Inventory?"

The chatbot will automatically:
1. Search knowledge base for relevant chunks
2. Include them in the context
3. Generate accurate answers

---

## 📊 How It Works

```
User Question
    ↓
Convert to Vector (embedding)
    ↓
Search Database (cosine similarity)
    ↓
Find Top 3 Most Relevant Chunks
    ↓
Include in ChatGPT Context
    ↓
Generate Answer
```

---

## 💰 Cost

**OpenAI Embeddings:**
- **One-time:** ~$0.01 per 100 pages
- **Ongoing:** ~$0.001 per 100 queries

**Example:**
- Upload 500 pages = $0.50 one-time
- 10,000 user questions/month = ~$1.00

**Total:** <$2/month for typical usage

---

## 🔧 Current Implementation

**Storage Method:** JSON strings in PostgreSQL  
**Why:** Works immediately - no pgvector extension needed

**Performance:**
- ✅ Works for <1000 chunks
- ⚠️ Gets slower with >10,000 chunks

---

## ⚡ Performance Upgrade (Optional)

If you have >1000 knowledge chunks, upgrade to pgvector:

### Enable pgvector on Render

1. Render Dashboard → PostgreSQL → Shell
2. Run: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Update Prisma schema:

```prisma
model KnowledgeChunk {
  ...
  embedding Unsupported("vector(1536)")  // Replace String?
  
  @@index([embedding], type: Ivfflat)  // Add index
}
```

4. Run: `npx prisma db push`

**Benefits:**
- 10-100x faster searches
- Supports millions of chunks
- Lower latency

---

## 📝 Best Practices

### Content to Upload

✅ **Good:**
- Product documentation
- FAQs
- Pricing sheets
- Case studies
- Technical specs

❌ **Avoid:**
- Very short snippets (<100 words)
- Duplicate content
- Outdated information

### Chunking Tips

- Current: ~500 words per chunk (good for most content)
- For FAQs: Each Q&A pair as separate upload
- For guides: Upload by section/chapter

### Maintenance

- **Review Chat Logs:** See what questions users ask
- **Update Knowledge:** Add missing info based on gaps
- **Delete Old Chunks:** Remove outdated information

---

## 🧪 Testing

1. Upload test document (e.g., product FAQ)
2. Go to Chat Logs → Ask test questions
3. Verify responses are accurate
4. Check if knowledge was used in response

---

## ❓ Troubleshooting

**"No relevant knowledge found"**
- Upload more content
- Make sure source field matches your query topic

**"Embedding failed"**
- Check `OPENAI_API_KEY` is set in Render
- Verify you have credits in OpenAI account

**Slow searches (>2 seconds)**
- You have >1000 chunks → Consider pgvector upgrade
- Or reduce chunk count by consolidating

---

## 🎯 Next Steps

1. **Upload your first knowledge base**
   - Start with product documentation
   - Or create a comprehensive FAQ

2. **Test thoroughly**
   - Ask various questions
   - Refine based on Chat Logs

3. **Expand gradually**
   - Add more documentation over time
   - Keep knowledge fresh and updated

---

**Questions?** Check the main `HANDOVER.md` or contact your development team.
