// src/services/api.ts
const BASE = 'https://ps-26063-backend.onrender.com/api';

export async function fetchEntity<T>(entity: string, params?: Record<string,string>): Promise<T[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const r = await fetch(`${BASE}/${entity}${qs}`);
  if (!r.ok) throw new Error(`Failed to fetch ${entity}`);
  return r.json();
}

export async function fetchById<T>(entity: string, id: string | number): Promise<T> {
  const r = await fetch(`${BASE}/${entity}/${id}`);
  if (!r.ok) throw new Error(`Not found: ${entity}/${id}`);
  return r.json();
}

export async function fetchStats(): Promise<Record<string,number>> {
  const r = await fetch(`${BASE}/stats`);
  if (!r.ok) throw new Error('Failed to fetch stats');
  return r.json();
}

export async function searchAll(q: string) {
  const r = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  if (!r.ok) throw new Error('Search failed');
  return r.json();
}

export async function postOutreach(body: object) {
  const r = await fetch(`${BASE}/outreach`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('Failed to post outreach');
  return r.json();
}