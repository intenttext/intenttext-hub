# IntentText Hub

The curated registry for `.it` templates — browse agent definitions, workflow patterns, and document templates.

Built with Next.js 14, MongoDB, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and admin token

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## MongoDB Setup

1. Create a DigitalOcean Managed MongoDB cluster
2. Create a database user with read/write permissions
3. Add your IP to the trusted sources (or 0.0.0.0/0 for Vercel)
4. Get your connection string from the cluster dashboard
5. Add `MONGODB_URI` to `.env.local`

### Create indexes

Run this once after connecting:

```javascript
db.templates.createIndex({ slug: 1 }, { unique: true })
db.templates.createIndex({ category: 1, status: 1 })
db.templates.createIndex({ tags: 1 })
db.templates.createIndex({ status: 1, createdAt: -1 })
db.templates.createIndex(
  { name: "text", description: "text", tags: "text" },
  { name: "search_index" }
)
```

### Seed starter templates

```bash
npm run seed
```

This inserts 9 starter templates (3 agents, 3 workflows, 3 documents). Safe to run multiple times — existing templates are skipped.

## Deploy

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add environment variables:
   - `MONGODB_URI`
   - `REQUIRE_APPROVAL=false`
   - `ADMIN_TOKEN`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy
5. Run seed: `npx ts-node lib/seed.ts` (with production `MONGODB_URI`)

## API

| Endpoint | Method | Description |
|---|---|---|
| `/api/templates` | GET | List templates (query: `category`, `q`, `limit`, `skip`) |
| `/api/templates/[slug]` | GET | Get single template |
| `/api/templates/[slug]` | POST | Increment download count |
| `/api/submit` | POST | Submit a new template |
| `/api/admin/approve` | GET | List pending templates (requires `Authorization` header) |
| `/api/admin/approve` | POST | Approve or reject a template (requires `Authorization` header) |

## Coming Soon

- **GitHub OAuth** — submit templates with your GitHub identity
- **intenttext install** — CLI to install templates directly into your project
- **Template composition** — combine multiple templates
- **Star and fork** — community curation
- **Org templates** — private template registries for teams
