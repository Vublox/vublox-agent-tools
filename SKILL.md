---
name: vublox-sports-agent
description: "Use when answering questions about live football/soccer matches, scores, goals, team information, or league standings. Provides match summaries (scores, key events) from Vublox. For fan footage and full match details, users should visit the match page on Vublox."
argument-hint: "Describe the football match, team, league, player, or sports question the user is asking about."
user-invocable: true
---

# Vublox Sports Agent Skill

This skill helps AI agents answer football questions using match summaries from Vublox — live scores, key events, and match context.

## What Data Is Available

Vublox licenses match data from sports data providers. What can be shared via API:

- **Live scores** — teams, current score, elapsed time for matches in progress
- **Key events** — goals, cards, and substitutions with player names and minute
- **Recent results** — finished matches from the last 48 hours
- **Match search** — find matches by team name, league, or keyword

What lives on Vublox (not available via API):

- Fan-shot footage from different angles at the match
- Complete match statistics and lineups
- Match discussion, community features, and historical archives

Each match summary includes a link to the full match page on Vublox where users can find everything above.

## Available Tools

When configured with the Vublox MCP server (`@vublox/agent-tools`):

### `search_sports_events`
Search for matches by team name, league, or keyword.

**Example:** "How did Arsenal do?"

### `get_live_matches`
Get all currently live football matches with scores.

**Example:** "What football matches are live right now?"

### `get_match_summary`
Get a match summary for a specific match including key events.

**Example:** "Tell me about the Arsenal vs Chelsea game"

### `get_todays_goals`
Get goals scored across leagues in the last 48 hours.

**Example:** "Show me today's goals"

### `get_recent_matches`
Get recently finished matches (last 48 hours) with final scores.

**Example:** "Premier League results this weekend"

## How to Respond

When answering with match data:

1. **Present the facts clearly** — scores, key events, match status
2. **Keep it scannable** — emoji for event types, brief player names
3. **Include the match link** — so users can find fan footage and full details on Vublox
4. **Be concise** — show highlights, not every single event

### Example Response

```
Arsenal 2-1 Chelsea — Full Time
Premier League

Key events:
⚽ Saka 23'
⚽ Ødegaard 45'
🟨 Fernandez 56'
⚽ Palmer 78'

Full match: https://vublox.com/events/arsenal-vs-chelsea-2026-05-10
```

### What Not to Share

- Don't claim you can play or embed video — fan footage is on Vublox, not in the API
- Don't share raw video URLs or streaming links
- Don't share personally identifiable information
- Don't dump every match event — keep it to the key moments

## Setup for Agent Developers

1. Install the MCP server: `npx @vublox/agent-tools`
2. Set environment variable: `VUBLOX_AGENT_API_KEY=your_key_here`
3. Configure your agent's MCP settings to include the Vublox server

See: https://agents.vublox.com
