# Ralph Agent Instructions - Lab Blog

## Your Task

1. Read `scripts/ralph/prd.json`
2. Read `scripts/ralph/progress.txt` (check Codebase Patterns first)
3. Ensure you're on the correct branch (`ralph/phase-1-core`)
4. Pick highest priority story where `passes: false` and no blockedBy stories are incomplete
5. Implement that ONE story completely
6. Run `npm run typecheck` and `npm run build`
7. Commit: `feat(lab): [ID] - [Title]`
8. Update prd.json: set `passes: true` for completed story
9. Append learnings to progress.txt

## Progress Format

APPEND to progress.txt:

```markdown
## [Date] - [Story ID]
- What was implemented
- Files changed
- **Learnings:**
  - Patterns discovered
  - Gotchas encountered
```

## Codebase Patterns

Add reusable patterns to the TOP of progress.txt under "## Codebase Patterns":

```markdown
## Codebase Patterns
- Astro: Use `.astro` for pages/components, `.ts` for utilities
- Content: All articles in src/content/articles/YYYY/MM/
- Schema: Zod validation in src/content/config.ts
```

## Key Technologies

- **Astro 4**: Static site generator with Content Collections
- **Tailwind CSS**: Utility-first styling
- **Zod**: Schema validation for content
- **TypeScript**: Strict mode enabled

## File Conventions

| Type | Location | Naming |
|------|----------|--------|
| Pages | `src/pages/` | `[name].astro` or `[...slug].astro` |
| Components | `src/components/` | `PascalCase.astro` |
| Layouts | `src/layouts/` | `PascalCase.astro` |
| Content | `src/content/articles/` | `YYYY/MM/slug.md` |
| API Endpoints | `src/pages/api/` | `name.json.ts` |

## Content Schema Fields

Articles must have:
- `title` (max 60 chars)
- `description` (max 160 chars)
- `publishedAt` (date)
- `topic` (ai | automation | experiments | engineering | personal)
- `status` (draft | review | published | archived)
- `validationLevel` (experimental | tested | production)

## Component Props Pattern

```typescript
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---
```

## Important Notes

- Run `npm install` if dependencies aren't installed
- Always check `npm run typecheck` before committing
- Keep components small and focused
- Use Tailwind for all styling (no custom CSS)
- Follow Astro's file-based routing conventions

## Stop Condition

If ALL stories in prd.json have `passes: true`, reply:

<promise>COMPLETE</promise>

Otherwise end normally after completing one story.
