# Vublox Agent Tools

> **Add live sports to your AI agent in 5 minutes.**

An MCP (Model Context Protocol) server that lets AI agents — Claude, Copilot, Cursor, GPT, and others — pull live football scores, match events, and goal summaries from Vublox.

**Teaser-only by design.** Agents get scores, key events, and thumbnails — just enough to answer a user's question. For full video highlights and deeper match coverage, every response includes a link to the match page on Vublox.

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
| `get_match_summary` | Detailed teaser for a specific match |
| `get_todays_goals` | Goals scored today across leagues |
| `get_recent_matches` | Recently finished matches (48h) |

## How It Works

```
User: "What's the Arsenal score?"
  ↓
Agent calls get_live_matches() via MCP
  ↓
Vublox API returns: Arsenal 2-1 Chelsea (67') — Saka 23', Ødegaard 45'
  ↓
Agent responds with scores + "🔗 Full highlights on Vublox: https://vublox.com/events/arsenal-vs-chelsea"
  ↓
User clicks link → lands on Vublox → watches highlights, discusses match
```

**The agent answers the question with live data. Users tap through to Vublox for video highlights and the full match experience.**

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
