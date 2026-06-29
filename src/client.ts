/**
 * Thin HTTP client for the Vublox Agent API.
 *
 * Open access — no API key required.
 * Handles rate limiting (429 → retry with backoff).
 */

import { AgentSportsResponse, AgentMatchSummary } from './types.js';

const DEFAULT_BASE_URL = 'https://api.vublox.com/api/client';

function getBaseUrl(): string {
  return (process.env.VUBLOX_API_BASE_URL || DEFAULT_BASE_URL).replace(
    /\/+$/g,
    '',
  );
}

async function fetchWithRetry(
  url: string,
  retries = 2,
): Promise<AgentSportsResponse> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      const delay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.pow(2, attempt) * 1000;
      console.warn(
        `[vublox-agent-tools] Rate limited. Retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `Vublox API error: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as AgentSportsResponse;
  }

  throw new Error('Vublox API rate limit exceeded. Try again later.');
}

export async function getLiveMatches(): Promise<AgentSportsResponse> {
  return fetchWithRetry(`${getBaseUrl()}/agent/sports/live`);
}

export async function getRecentMatches(): Promise<AgentSportsResponse> {
  return fetchWithRetry(`${getBaseUrl()}/agent/sports/recent`);
}

export async function searchMatches(
  query: string,
): Promise<AgentSportsResponse> {
  return fetchWithRetry(
    `${getBaseUrl()}/agent/sports/search?q=${encodeURIComponent(query)}`,
  );
}

export async function getMatchSummary(
  eventId: string,
): Promise<AgentMatchSummary | null> {
  const url = `${getBaseUrl()}/agent/sports/event/${encodeURIComponent(eventId)}`;

  try {
    const data = await fetchWithRetry(url);
    return data.matches?.[0] || null;
  } catch (err: any) {
    if (err.message?.includes('404')) return null;
    throw err;
  }
}
