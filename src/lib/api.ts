export type Site = {
  id: number; name: string; country: string; region: string | null; latitude: number | null; longitude: number | null; construction_period: string | null; description: string;
};
export type Evidence = { id: number; year: number; title: string; evidence_type: string; source: string; description: string; confidence: number; image_url: string | null; };
export type Prediction = { id: number; horizon_years: number; scenario: string; risk_score: number; confidence: number; drivers: string[]; recommendations: string[]; image_url: string | null; explanation: string; };
export type RiskResult = { risk_score: number; priority: string; label: string; band: string; formula: string; };
export type Inspection = { id: number; site_id: number | null; original_filename: string; status: string; site_confidence: number; site_identification: string | null; analysis: Record<string, any>; environment: Record<string, any>; report: { risk_score?: number; risk_band?: string; drivers?: string[]; recommendations?: string[]; historical_visuals?: { year: number; image_url: string; label: string }[]; evidence_policy?: string; }; created_at: string; };
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${API_BASE}${path}`, init); if (!response.ok) throw new Error((await response.text()) || `API request failed (${response.status})`); return response.json(); }
export function apiFileUrl(path: string | null) { if (!path) return null; return path.startsWith('http') ? path : `${API_BASE}${path}`; }
export function getSites() { return request<Site[]>('/api/v1/sites', { cache: 'no-store' }); }
export function getEvidence(siteId: number) { return request<Evidence[]>(`/api/v1/sites/${siteId}/evidence`, { cache: 'no-store' }); }
export function getPredictions(inspectionId: number) { return request<Prediction[]>(`/api/v1/inspections/${inspectionId}/predictions`, { cache: 'no-store' }); }
export async function createInspection(file: File, siteId?: number, siteHint?: string) { const form = new FormData(); form.append('image', file); if (siteId) form.append('site_id', String(siteId)); if (siteHint) form.append('site_hint', siteHint); return request<Inspection>('/api/v1/inspections', { method: 'POST', body: form }); }

export function calculateRisk(input: { severity: number; rate_of_change: number; significance: number; exposure: number }) { return request<RiskResult>('/api/v1/risk/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }); }
