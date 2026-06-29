# Vublox Agent Tools

> **Let AI agents discover live football matches and fan clips on Vublox.**

An MCP (Model Context Protocol) server that lets AI agents find football matches on Vublox — which matches are live or recent, what the score is, and when they kicked off. Each result links to the match page on Vublox where users can watch fan-shot footage, see full stats, and join the discussion.

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
