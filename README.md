# Vublox Agent Tools

> **Let AI agents discover live football matches and fan clips on Vublox.**

An MCP (Model Context Protocol) server that lets AI agents find football matches on Vublox — which matches are live or recent, what the score is, when they kicked off, and links to fan-shot video clips. Each result links to the match page on Vublox where users can watch fan footage and join the discussion.

No API key required — just install and use.

## Quick Start

### 1. Install & Configure

**Claude Desktop:**
```json
// claude_desktop_config.json
{
  "mcpServers": {
    "vublox-sports": {
      "command": "npx",
      "args": ["@vublox/agent-tools"]
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
      "args": ["@vublox/agent-tools"]
    }
  }
}
```

### 2. Ask Your Agent

Try these in your agent:
- "What football matches are live right now?"
- "How did Arsenal do today?"
- "Show me today's Premier League scores"
- "Tell me about the Barcelona vs Real Madrid match"

## Available Tools

| Tool | Description |
|------|-------------|
| `search_sports_events` | Search matches by team, league, or keyword |
| `get_live_matches` | All currently live football matches |
| `get_match_summary` | Match info for a specific match |
| `get_todays_goals` | Recent match scores across leagues (last 48h) |
| `get_recent_matches` | Recently finished matches (last 48h) |

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VUBLOX_API_BASE_URL` | No | Override API base URL (default: production) |

## License

MIT — Vublox
