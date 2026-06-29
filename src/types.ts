/**
 * Shared types between the MCP server and the Vublox Agent API.
 */

export interface AgentKeyEvent {
  type:
    | 'goal'
    | 'yellow_card'
    | 'red_card'
    | 'penalty'
    | 'penalty_missed'
    | 'own_goal'
    | 'substitution'
    | 'penalty_scored';
  minute: number;
  player?: string;
  description: string;
}

export interface AgentMatchSummary {
  id: string;
  vublox_url: string;
  highlights_url: string;
  name: string;
  home_team: { name: string; score: number | null };
  away_team: { name: string; score: number | null };
  league: string;
  status: 'live' | 'finished';
  started_at: string;
  elapsed_minutes?: number;
  key_events: AgentKeyEvent[];
  thumbnail_url?: string;
  match_stats_summary?: string;
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
