# Vublox Agent Tools

> **Live football scores and match events for AI agents — via MCP.**

An MCP (Model Context Protocol) server that gives AI agents access to structured football match summaries from Vublox: live scores, key events (goals, cards, substitutions), and match context.

## What This Provides

This API shares match summaries — scores and key events — which is what Vublox is licensed to distribute. For the full match experience, each response includes a link to the match page on Vublox:

| Available via API | Available on Vublox |
|-------------------|---------------------|
| Live scores & match status | Full video highlights |
| Key events (goals, cards, subs) | Complete match statistics |
| Team names & league | Lineups & formations |
| Kickoff time & elapsed minutes | Match discussion & community |
| — | Historical match archives |

## Quick Start

### 1. Get an API Key

Visit [agents.vublox.com](https://agents.vublox.com) to request an API key.

### 2. Install & Configure

**Claude Desktop:**
```json
// claude_desktop_config.json
{
  "mcpServers": {
    "vublox-sports": {
      "command": "npx",
      "args": ["@vublox/agent-tools"],
      "env": {
        "VUBLOX_AGENT_API_KEY": "your-key-here"
      }
    }
  }
}
```

**VS Code Copilot:**
```json
// .vscode/mcp.json
{
  "servers": {
    "vublox-sports": {
      "type": "stdio",
      "command": "npx",
      "args": ["@vublox/agent-tools"],
      "env": {
        "VUBLOX_AGENT_API_KEY": "your-key-here"
      }
    }
  }
}
```

### 3. Ask Your Agent

Try these in your agent:
- "What football matches are live right now?"
- "How did Arsenal do today?"
- "Show me today's Premier League goals"
- "Tell me about the Barcelona vs Real Madrid match"

## Available Tools

| Tool | Description |
|------|-------------|
| `search_sports_events` | Search matches by team, league, or keyword |
| `get_live_matches` | All currently live football matches |
| `get_match_summary` | Match summary for a specific match |
| `get_todays_goals` | Goals scored across leagues (last 48h) |
| `get_recent_matches` | Recently finished matches (last 48h) |

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VUBLOX_AGENT_API_KEY` | Yes | Your Vublox agent API key |
| `VUBLOX_API_BASE_URL` | No | Override API base URL (default: production) |

## License

MIT — Vublox
