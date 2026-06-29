/**
 * Shared types between the MCP server and the Vublox Agent API.
 */

export interface AgentMatchSummary {
  id: string;
  vublox_url: string;
  name: string;
  league: string;
  status: 'live' | 'finished';
  started_at: string;
  home_score: number | null;
  away_score: number | null;
}

export interface AgentSportsResponse {
  matches: AgentMatchSummary[];
  attribution: {
    provider: string;
    url: string;
    message: string;
  };
  generated_at: string;
}
