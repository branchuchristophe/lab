---
title: "Building LifeOS: Standing on Shoulders"
description: "How I built my personal AI operating system by composing open-source tools, MCP servers, and custom integrations."
publishedAt: 2026-01-21
author: "Christophe"
topic: "ai"
tags: ["lifeos", "agents", "mcp", "automation", "claude-code", "open-source"]
status: "published"
featured: true

# AI Co-authorship
coauthored: true
aiContributors: ["Claude Opus 4.5"]
coauthorNote: "Claude helped organize the component inventory and draft the integration patterns section"
validationLevel: "tested"

# SEO
keywords: ["ai operating system", "claude code", "mcp servers", "personal ai", "agent automation"]
schemaType: "Article"

# Agent Actions
claudeUrl: "https://claude.ai/new?q=How+can+I+build+a+personal+AI+operating+system+like+LifeOS?"
chatgptUrl: "https://chat.openai.com/?q=What+tools+do+I+need+to+build+an+AI+powered+personal+assistant?"
githubUrl: "https://github.com/branchuchristophe/life-os"

# Machine Context
purpose: "Document the architecture and third-party components that make up LifeOS"
prerequisites: ["Familiarity with CLI tools", "Basic understanding of AI agents", "Node.js experience helpful"]
outputs: ["Understanding of LifeOS architecture", "List of reusable open-source components", "Patterns for integrating AI agents"]
codeLanguages: ["javascript", "typescript", "bash", "python"]
---

## What is LifeOS?

LifeOS is my personal AI operating system - a collection of tools, automations, and AI agents that help me work faster. Claude Code acts as my COO/CTO, handling everything from code reviews to email management to content strategy.

But here's the thing: **I didn't build most of it from scratch.**

The real work was in discovering, evaluating, and integrating existing tools. This article documents what I borrowed, what I built, and how it all fits together.

## The Core Philosophy: Compose, Don't Build

Before diving into components, the key principle: **think in primitives, not features**.

When I need new functionality, I:
1. Check if an open-source tool exists
2. If yes, integrate it (even if it's 80% of what I want)
3. If no, build the minimal primitive and add it to my toolkit
4. After using it, capture lessons for next time

This compounds. Every tool I integrate becomes available for future compositions.

## Third-Party Components

### 1. Ralph: Autonomous Coding Loop

**Source**: [subsy/ralph-tui](https://github.com/subsy/ralph-tui)

Ralph is the crown jewel. It runs Claude Code in an autonomous loop until a set of user stories is complete. Ship features while you sleep.

**What I borrowed:**
- The core loop concept (iterate until `prd.json` stories pass)
- The memory model (fresh context per iteration, persist via git + files)
- The PRD-based task tracking

**What I tweaked:**
- Simplified the setup (just 3 files: `ralph.sh`, `prd.json`, `progress.txt`)
- Added codebase pattern capture in `progress.txt`
- Integrated with my backlog system for compound learning

**How I use it:**
```bash
# 1. Define user stories in prd.json
# 2. Run up to 25 iterations
./scripts/ralph/ralph.sh 25
# 3. Wake up to commits
```

### 2. MCP Servers (Model Context Protocol)

MCP is Anthropic's protocol for giving Claude access to external tools. I run 8 MCP servers:

| Server | Package | What It Does |
|--------|---------|--------------|
| Filesystem | [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers) | Read/write files |
| Memory | [@modelcontextprotocol/server-memory](https://github.com/modelcontextprotocol/servers) | Persistent knowledge graph |
| Gmail | [@mcp-z/mcp-gmail](https://github.com/mcp-z/mcp-gmail) | Email management |
| Calendar | [mcp-google-calendar](https://github.com/anthropics/cookbook) | Event scheduling |
| Whisper | [MLX Whisper](https://github.com/ml-explore/mlx-examples) | Local audio transcription |
| Mac Control | Custom | UI automation |
| Scraper | Custom | Web content extraction |
| Claude in Chrome | [nicholasareed/claude-in-chrome](https://chromewebstore.google.com/detail/claude-in-chrome/ocfobphiodkamlgfhfblikcimfhohebg) | Browser automation |

**What I borrowed:**
- All the official MCP servers (filesystem, memory)
- Community packages (gmail, calendar)
- MLX Whisper for Apple Silicon transcription

**What I built:**
- Mac Control MCP (semantic UI automation with accessibility tree parsing)
- Scraper MCP (Playwright-based content extraction)

### 3. ClawdBot: Telegram Gateway

I needed to control Claude Code from my phone. Discord was too clunky. So I built ClawdBot - a Telegram bot that routes messages to Claude.

**Architecture:**
```
Telegram (LifeOS bot) → ClawdBot Gateway → Claude Code CLI
Telegram (Nova bot)   ↗
```

**What I borrowed:**
- Telegram Bot API patterns
- PM2 for process management
- The idea of multi-agent routing from [Anthropic's cookbook](https://github.com/anthropics/cookbook)

**What I built:**
- The gateway itself (Node.js)
- Multi-agent routing (LifeOS for technical, Nova for content)
- Task queue for async operations

### 4. Council: Multi-Model Debate

Before implementing complex features, I run them through "the Council" - parallel critiques from OpenAI, Gemini, and Claude.

**Inspired by:**
- [Constitutional AI](https://arxiv.org/abs/2212.08073) (Anthropic's research)
- The concept of adversarial review in code reviews

**What I borrowed:**
- LiteLLM for multi-model API calls
- The spec-based approach from Ralph

**What I built:**
- The debate orchestration (Python)
- Telegram integration for mobile monitoring
- Spec evolution between rounds

**How it works:**
```bash
python3 debate.py --spec-file feature.md --telegram --max-rounds 5
```

Each round: all models critique the spec in parallel, then LifeOS synthesizes feedback and updates the spec.

### 5. Mac Control: Semantic UI Automation

Most UI automation requires coordinates: "click at (450, 320)". Fragile. Instead, Mac Control uses:

**Tier 1: Accessibility API** (free, ~200ms)
```
"click Submit button" → parse AX tree → find element → click center
```

**Tier 2: Claude Vision** (fallback, ~$0.03)
```
screenshot → analyze image → find element → click
```

**What I borrowed:**
- [cliclick](https://github.com/BlueM/cliclick) for mouse/keyboard control
- macOS Accessibility APIs
- Claude's vision capabilities

**What I built:**
- Semantic element matching (Levenshtein distance scoring)
- Two-tier architecture with fallback
- Element caching for repeated interactions

### 6. Feature Pipeline

A systematic workflow for handling feature requests:

```
CAPTURE → STRUCTURE → REFINE → PLAN → IMPLEMENT → SIMPLIFY → VERIFY → COMPOUND
```

**Inspired by:**
- Shape Up (Basecamp's methodology)
- [Compound engineering](https://every.to/chain-of-thought) from Every.to

**Tools composed:**
- Backlog system (bash script for story tracking)
- Council (multi-model review)
- Plan Mode (Claude Code's built-in)
- Ralph (autonomous implementation)
- Code Simplifier (cleanup pass)

## Integration Patterns

### Pattern 1: File-Based Communication

When components need to share state, I use files:

```
data/shared/
├── nova-calendar.json      # Nova's content calendar
├── lab-updates-*.json      # Status updates
└── queue/lifeos-tasks.json # Task queue
```

Why files? They're debuggable, version-controllable, and work across any language.

### Pattern 2: LaunchAgents for Scheduling

macOS LaunchAgents handle cron-like scheduling:

```xml
<plist>
  <dict>
    <key>Label</key>
    <string>com.lifeos.daily-review</string>
    <key>ProgramArguments</key>
    <array>
      <string>/path/to/daily-review.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key>
      <integer>20</integer>
    </dict>
  </dict>
</plist>
```

Currently running 24 automations: 4 daemons, 14 scheduled, 6 interval-based.

### Pattern 3: Keychain for Secrets

1Password is great for storage, but prompts for Touch ID. For autonomous operation:

```bash
# Store secret
security add-generic-password -s "lifeos-api-key" -a "secret" -w "sk-..."

# Retrieve (no prompts)
security find-generic-password -s "lifeos-api-key" -a "secret" -w
```

### Pattern 4: Progress Files for Learning

Every Ralph run, every Council debate, every significant session writes to a progress file:

```markdown
## 2026-01-21 - LAB-007
- Implemented JSON API endpoint
- **Learnings:**
  - getCollection() returns all articles, filter by status
  - Content summary: collapse whitespace, take first 200 chars
  - Cache-Control header for API responses
```

This compounds. Future iterations have context about what worked.

## What I'd Build Differently

**More composable from day one.** Early systems were monolithic. Now everything is a primitive that can be composed.

**Better error boundaries.** When an MCP server fails, it shouldn't bring down the whole system.

**Standardized logging.** Every component logs differently. A unified format would help debugging.

## Getting Started

Want to build something similar? Start here:

1. **Install Claude Code**: The foundation
2. **Add MCP servers**: Start with filesystem and memory
3. **Set up ClawdBot** (or similar): Remote control is invaluable
4. **Copy Ralph templates**: `~/.claude/templates/ralph/`
5. **Build incrementally**: Add one component at a time, capture learnings

The magic isn't in any single tool - it's in the composition.

## Resources

- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers) - Official MCP servers
- [ralph-tui](https://github.com/subsy/ralph-tui) - Original Ralph implementation
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code) - Official docs
- [MLX Examples](https://github.com/ml-explore/mlx-examples) - Apple Silicon ML tools
- [cliclick](https://github.com/BlueM/cliclick) - macOS mouse/keyboard control

---

*LifeOS is a personal project. Your mileage may vary. But the pattern - composing existing tools with minimal custom glue - works.*
