#!/usr/bin/env node

/**
 * Vublox Agent Tools — MCP Server
 *
 * Provides AI agents with football match discovery from Vublox:
 * which matches are live or recent, scores, and kickoff times.
 * For fan footage and full match details, each response includes a
 * link to the match page on Vublox.
 *
 * Usage:
 *   npx @vublox/agent-tools
 *   # Requires: VUBLOX_AGENT_API_KEY environment variable
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  getLiveMatches,
  getRecentMatches,
  searchMatches,
  getMatchSummary,
} from './client.js';
import type { AgentMatchSummary, AgentSportsResponse } from './types.js';

// ═══════════════════════════════════════════════════════════════
// Text Formatters
// ═══════════════════════════════════════════════════════════════

function formatMatch(m: AgentMatchSummary): string {
  const statusLabel = m.status === 'live' ? 'LIVE' : 'FT';
  const scoreLine = `${m.home_score ?? '-'}-${m.away_score ?? '-'}`;
  let result = `${m.name} ${scoreLine} (${statusLabel}) — ${m.league}\n🔗 Match page: ${m.vublox_url}`;

  if (m.clips?.length) {
    const clipLinks = m.clips
      .map((c) => `  🎥 Fan clip: ${c.vublox_url}`)
      .join('\n');
    result += '\n' + clipLinks;
  }

  return result;
}

function formatMatchList(response: AgentSportsResponse): string {
  if (!response.matches.length) {
    return `No matches found.\n\n🔗 Explore matches on Vublox: ${response.attribution.url}`;
  }

  const lines = response.matches.map(formatMatch);
  const footer = `\n───\nvia Vublox • ${response.matches.length} matches • ${response.attribution.url}`;

  return [...lines, footer].join('\n\n');
}

function formatScoreList(response: AgentSportsResponse): string {
  if (!response.matches.length) {
    return `No recent matches found.\n\n🔗 Explore matches on Vublox: ${response.attribution.url}`;
  }

  const lines = response.matches.map(
    (m) => `  ${m.home_score ?? '-'}-${m.away_score ?? '-'}  ${m.name} — ${m.league}`,
  );

  return [`Recent scores:\n`, ...lines, `\n🔗 More on Vublox: ${response.attribution.url}`].join('\n');
}

function formatMatchDetail(summary: AgentMatchSummary | null): string {
  if (!summary) {
    return `Match not found.\n\n🔗 Explore matches on Vublox: https://vublox.com`;
  }
  return formatMatch(summary);
}

// ═══════════════════════════════════════════════════════════════
// Server
// ═══════════════════════════════════════════════════════════════

const server = new Server(
  {
    name: 'vublox-agent-tools',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// ── Tool Definitions ──────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_sports_events',
      description:
        'Search for live or recent football (soccer) matches on Vublox by team name, league, or keyword. Returns match names, scores, clip links, and match page links on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Search term — team name (e.g. "Arsenal"), league (e.g. "Premier League"), or keyword',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_live_matches',
      description:
        'Get all currently live football (soccer) matches with scores via Vublox. Each result includes links to the match page and fan clips on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_match_summary',
      description:
        'Get basic match info for a specific football match by Vublox event ID. Includes links to the match page and fan clips on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description:
              'The Vublox event ID (UUID) for the match. Obtain from search_sports_events or get_live_matches results.',
          },
        },
        required: ['event_id'],
      },
    },
    {
      name: 'get_todays_goals',
      description:
        'Get recent football match scores (last 48 hours) across all leagues via Vublox. Each result includes links to match pages on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_recent_matches',
      description:
        'Get recently finished football matches (last 48 hours) via Vublox. Returns final scores and links to match pages and fan clips on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ],
}));

// ── Tool Execution ────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_sports_events': {
        const query = String(args?.query || '').trim();
        if (!query) {
          return {
            content: [
              {
                type: 'text',
                text: 'Please provide a search query (team name, league, or keyword).',
              },
            ],
          };
        }
        const result = await searchMatches(query);
        return {
          content: [{ type: 'text', text: formatMatchList(result) }],
        };
      }

      case 'get_live_matches': {
        const result = await getLiveMatches();
        return {
          content: [{ type: 'text', text: formatMatchList(result) }],
        };
      }

      case 'get_match_summary': {
        const eventId = String(args?.event_id || '').trim();
        if (!eventId) {
          return {
            content: [
              { type: 'text', text: 'Please provide an event_id.' },
            ],
          };
        }
        const summary = await getMatchSummary(eventId);
        return {
          content: [
            {
              type: 'text',
              text: formatMatchDetail(summary),
            },
          ],
        };
      }

      case 'get_todays_goals': {
        const result = await getRecentMatches();
        return {
          content: [{ type: 'text', text: formatScoreList(result) }],
        };
      }

      case 'get_recent_matches': {
        const result = await getRecentMatches();
        return {
          content: [{ type: 'text', text: formatMatchList(result) }],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}. Available tools: search_sports_events, get_live_matches, get_match_summary, get_todays_goals, get_recent_matches.`,
            },
          ],
        };
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message || 'Unknown error'}. Check your VUBLOX_AGENT_API_KEY and try again. Get a key at https://agents.vublox.com`,
        },
      ],
      isError: true,
    };
  }
});

// ═══════════════════════════════════════════════════════════════
// Start
// ═══════════════════════════════════════════════════════════════

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[vublox-agent-tools] MCP server running on stdio');
}

main().catch((err) => {
  console.error('[vublox-agent-tools] Fatal error:', err);
  process.exit(1);
});
