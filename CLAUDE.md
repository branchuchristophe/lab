# Lab - Agent-Native Blog Platform

> **This repo is managed by LifeOS agent. Read `~/.claude/CLAUDE.md` for core instructions.**

## Project Overview

Lab is an agent-native blog platform for publishing AI & automation content. It's designed for both human readers and machine consumption (scrapers, LLMs, agents).

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 4 (static output) |
| Styling | Tailwind CSS |
| Content | Astro Content Collections (Markdown + Zod) |
| Database | PostgreSQL (via Drizzle ORM) |
| Cache | Redis Cluster |
| Hosting | Vercel |
| CLI | Commander.js + tsx |

## Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run typecheck        # TypeScript check

# CLI
npm run cli draft "topic"         # Generate article draft
npm run cli publish slug.md       # Publish article
npm run cli audit slug            # SEO audit
npm run cli suggest               # Content ideas

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:load        # Run load tests
```

## Directory Structure

```
src/
  content/           # Astro Content Collections
    articles/        # Blog posts (markdown)
    topics/          # Topic metadata (JSON)
    series/          # Series metadata (JSON)
    authors/         # Author profiles (JSON)
  pages/
    api/             # JSON endpoints for agents
    articles/        # Article pages
    topics/          # Topic hub pages
    feed/            # RSS/Atom feeds
  components/        # Astro components
  layouts/           # Page layouts

cli/
  commands/          # CLI command handlers
  lib/               # Shared utilities
  templates/         # Content templates for fallback

data/
  queue/             # File-based job queue
  cache/             # File-based cache
  shared/            # Nova calendar sync files
  templates/         # Fallback content templates

database/
  schema.sql         # PostgreSQL schema
  migrations/        # Database migrations
```

## Content Model

Articles have these key fields:
- `title`, `description` - SEO-optimized
- `topic`, `tags` - Taxonomy
- `coauthored`, `aiContributors` - AI transparency
- `validationLevel` - experimental/tested/production
- `status` - draft/review/published/archived

## Agent Actions

Each article can have:
- `claudeUrl` - Pre-filled Claude conversation
- `chatgptUrl` - ChatGPT link
- `githubUrl` - Related code

## JSON API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/articles.json` | Full article index |
| `/api/articles/recent.json` | Recent 10 articles |
| `/api/topics.json` | Topic taxonomy |
| `/api/search.json` | Search index |

## Integration Points

### Marketing Skill
- `lab draft` invokes `/marketing write blog` for content generation
- Falls back to local templates if marketing skill unavailable

### Nova Calendar
- Reads from `data/shared/nova-calendar.json`
- Writes status updates to `data/shared/lab-updates-*.json`

### Notifications
- Uses ClawdBot for Telegram notifications
- Configurable via notification service abstraction

## Validation Markers

In content, use these markers:
- `<Validated />` - Human-tested pattern
- `<Experimental />` - Needs more testing
- `<ClaudeSuggestion />` - Claude's contribution

## When Working on This Repo

1. **Before changes**: Run `npm run typecheck`
2. **After changes**: Run `npm run build` to verify
3. **Content changes**: Validate schema with Astro build
4. **Database changes**: Use migrations, never manual SQL
5. **API changes**: Update JSON response types

## Common Tasks

### Add new article
```bash
npm run cli draft "Topic Name"
# Edit the generated file
npm run cli publish article-slug.md
```

### Update content schema
1. Edit `src/content/config.ts`
2. Run `npm run typecheck`
3. Update existing articles if needed

### Deploy
```bash
npm run build
vercel --prod
```
