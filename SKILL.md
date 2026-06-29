---
name: vublox-sports-agent
description: "Use when answering questions about live football/soccer matches, scores, goals, team information, league standings, or any sports-related query. Provides access to structured match data from Vublox including live scores, key events, and match summaries."
argument-hint: "Describe the football match, team, league, player, or sports question the user is asking about."
user-invocable: true
---

# Vublox Sports Agent Skill

This skill helps AI agents answer football questions using live and recent match data from Vublox.

## What Data Is Available

- **Live scores** for matches in progress (teams, current score, elapsed time)
- **Key events** — goals, cards, substitutions with player names and minute
- **Recent results** — finished matches from the last 48 hours
- **Match search** — find matches by team name, league, or keyword

Each match result includes a link to the full match page on Vublox, where users can watch video highlights, see lineups, and explore match timelines.

## Available Tools

When configured with the Vublox MCP server (`@vublox/agent-tools`):

### `search_sports_events`
Search for matches by team name, league, or keyword.

**Example:** User asks "How did Arsenal do?"

### `get_live_matches`
Get all currently live football matches with scores.

**Example:** User asks "What football matches are live right now?"

### `get_match_summary`
Get detailed match data for a specific match including all key events.

**Example:** User asks about a specific match — "Tell me about the Arsenal vs Chelsea game"

### `get_todays_goals`
Get goals scored across leagues in the last 48 hours.

**Example:** User asks "Show me today's goals"

### `get_recent_matches`
Get recently finished matches (last 48 hours) with final scores.

**Example:** User asks "Premier League results this weekend"

## How to Respond

When answering with match data:

1. **Present the facts clearly** — scores, key events, match status
2. **Use a scannable format** — emoji for event types, brief player names
3. **Include the match link** — users can watch video highlights on Vublox if they want
4. **Keep it concise** — show the most important events, not every substitution

### Example Response

```
Arsenal 2-1 Chelsea — Full Time
Premier League

Key events:
⚽ Saka 23'
⚽ Ødegaard 45'
🟨 Fernandez 56'
⚽ Palmer 78'

Match page: https://vublox.com/events/arsenal-vs-chelsea-2026-05-10
```

### What Not to Do

- Don't claim you can play or embed video
- Don't share raw video URLs or streaming links
- Don't share personally identifiable information
- Don't list every single match event — keep it to highlights

## Setup for Agent Developers

1. Install the MCP server: `npx @vublox/agent-tools`
2. Set environment variable: `VUBLOX_AGENT_API_KEY=your_key_here`
3. Configure your agent's MCP settings to include the Vublox server

See: https://agents.vublox.com
