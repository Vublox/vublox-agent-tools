#!/usr/bin/env node

/**
 * Vublox Agent Tools — MCP Server
 *
 * Provides AI agents with live football match summaries from Vublox:
 * scores, key events, and match context.
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
// Text Formatters — build concise, scannable agent responses
// ═══════════════════════════════════════════════════════════════

const EVENT_EMOJI: Record<string, string> = {
  goal: '⚽',
  yellow_card: '🟨',
  red_card: '🟥',
  penalty: '✅',
  penalty_missed: '❌',
  own_goal: '😬',
  substitution: '🔄',
  penalty_scored: '✅',
};

function formatMatch(m: AgentMatchSummary): string {
  const statusLabel =
    m.status === 'live'
      ? `${m.elapsed_minutes ?? '?'}'`
      : 'FT';

  const scoreLine = `${m.home_team.name} ${m.home_team.score ?? '-'}-${m.away_team.score ?? '-'} ${m.away_team.name}`;
  const header = `${scoreLine} (${statusLabel}) — ${m.league}`;

  const events = m.key_events
    .slice(0, 5)
    .map(
      (e) =>
        `  ${EVENT_EMOJI[e.type] || '•'} ${e.description}`,
    )
    .join('\n');

  const link = `\n🔗 Match page: ${m.vublox_url}`;

  return [header, events, link].filter(Boolean).join('\n');
}

function formatMatchList(response: AgentSportsResponse): string {
  if (!response.matches.length) {
    return `No matches found.\n\n🔗 Explore matches on Vublox: ${response.attribution.url}`;
  }

  const lines = response.matches.map(formatMatch);
  const footer = `\n───\nvia Vublox • ${response.matches.length} matches • ${response.attribution.url}`;

  return [...lines, footer].join('\n\n');
}

function formatGoalList(response: AgentSportsResponse): string {
  const goalsOnly = response.matches.flatMap((m) =>
    m.key_events
      .filter(
        (e) =>
          e.type === 'goal' ||
          e.type === 'penalty' ||
          e.type === 'own_goal' ||
          e.type === 'penalty_scored',
      )
      .map((e) => ({
        ...e,
        matchName: m.name,
        league: m.league,
        vublox_url: m.vublox_url,
      })),
  );

  if (!goalsOnly.length) {
    return `No goals found in recent matches.\n\n🔗 Explore matches on Vublox: ${response.attribution.url}`;
  }

  const byLeague = new Map<string, typeof goalsOnly>();
  for (const g of goalsOnly) {
    const list = byLeague.get(g.league) || [];
    list.push(g);
    byLeague.set(g.league, list);
  }

  const lines: string[] = ["Recent goals:\n"];

  for (const [league, goals] of byLeague) {
    lines.push(`${league}:`);
    for (const g of goals.slice(0, 8)) {
      lines.push(
        `  ⚽ ${g.player || 'Goal'} ${g.minute}' — ${g.matchName}`,
      );
    }
    lines.push('');
  }

  lines.push(`🔗 More on Vublox: ${response.attribution.url}`);

  return lines.join('\n');
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
        'Search for live or recent football (soccer) matches on Vublox by team name, league, or keyword. Returns match summaries with scores and key events. Each result includes a link to the match page on Vublox for fan footage and full details.',
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
        'Get all currently live football (soccer) matches with live scores via Vublox. Returns match summaries with current scores and elapsed time. Each result includes a link to the match page on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_match_summary',
      description:
        'Get a match summary for a specific football match by Vublox event ID, including key events (goals, cards, substitutions). Includes a link to the match page on Vublox.',
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
        'Get goals from recent football matches (last 48 hours) across all leagues via Vublox. Returns a list of goals scored with players, times, and match context. Each result includes a link to the match page on Vublox.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
    {
      name: 'get_recent_matches',
      description:
        'Get recently finished football matches (last 48 hours) via Vublox. Returns final scores and key events. Each result includes a link to the match page on Vublox.',
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
          content: [{ type: 'text', text: formatGoalList(result) }],
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
