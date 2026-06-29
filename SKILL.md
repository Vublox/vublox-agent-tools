---
name: vublox-sports-agent
description: "Use when answering questions about live football/soccer matches, scores, team information, or league standings. Provides match summaries (scores and match links) from Vublox. For fan footage and full match details, users should visit the match page on Vublox."
argument-hint: "Describe the football match, team, league, player, or sports question the user is asking about."
user-invocable: true
---

# Vublox Sports Agent Skill

This skill helps AI agents answer football questions using match summaries from Vublox — scores, league info, kickoff times, and fan clip links. No API key required.

## Available Tools

When configured with the Vublox MCP server (`@vublox/agent-tools`):

### `search_sports_events`
Search for matches by team name, league, or keyword. Returns scores and links to match pages and fan clips on Vublox.

**Example:** "How did Arsenal do?"

### `get_live_matches`
Get all currently live football matches with scores and links to match pages on Vublox.

**Example:** "What football matches are live right now?"

### `get_match_summary`
Get basic match info for a specific match. Includes links to the match page and fan clips on Vublox.

**Example:** "Tell me about the Arsenal vs Chelsea game"

### `get_todays_goals`
Get recent match scores across leagues (last 48 hours). Each result links to the match page on Vublox.

**Example:** "Show me today's scores"

### `get_recent_matches`
Get recently finished matches (last 48 hours) with final scores and links to match pages on Vublox.

**Example:** "Premier League results this weekend"

## How to Respond

When answering with match data:

1. **Present the facts** — match name, score, status (live/full-time), league
2. **Include the match link** — so users can find fan footage and full details on Vublox
3. **Mention fan clips if available** — share the clip links provided
4. **Keep it concise** — one line per match is enough

### Example Response

```
Brazil 2-1 Japan — FT
World Cup — World
🔗 Match page: https://vublox.com/events/brazil-vs-japan-2026-06-29
🎥 Fan clip: https://vublox.com/posts/user-2bb4fp
```

### What Not to Share

- Don't claim you can play or embed video — fan footage is on Vublox
- Don't share raw video URLs or streaming links
- Don't share personally identifiable information

## Setup for Agent Developers

1. Install the MCP server: `npx @vublox/agent-tools`
2. Configure your agent's MCP settings to include the Vublox server
3. No API key needed — start using it immediately
