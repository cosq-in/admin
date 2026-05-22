const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/gothicco";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Bots ──────────────────────────────────────────────────────────────────────

export interface FakeAccount {
  id: string;
  handle: string;
  display_name: string;
  personality_type: string;
}

export const listBots = () => apiFetch<FakeAccount[]>("/admin/bots");

export const createBot = (data: Omit<FakeAccount, "id"> & { avatar_url?: string; custom_lore?: string }) =>
  apiFetch<FakeAccount>("/admin/bots", { method: "POST", body: JSON.stringify(data) });

// ── Generate ──────────────────────────────────────────────────────────────────

export interface GenerateRequest {
  personality: string;
  count: number;
  extra_context?: string;
}

export interface GeneratedPost {
  content: string;
  tag: string;
}

export interface GenerateResponse {
  inserted: number;
  posts: GeneratedPost[];
}

export const generatePosts = (botId: string, req: GenerateRequest) =>
  apiFetch<GenerateResponse>(`/admin/generate?fake_account_id=${botId}`, {
    method: "POST",
    body: JSON.stringify(req),
  });

// ── App Settings ──────────────────────────────────────────────────────────────

export interface EventState {
  enabled: boolean;
  message: string;
}

export const get3amEvent = () =>
  apiFetch<EventState>("/admin/settings/3am-event");

export const set3amEvent = (enabled: boolean, message: string) =>
  apiFetch<EventState>("/admin/settings/3am-event", {
    method: "PATCH",
    body: JSON.stringify({ enabled, message }),
  });

// ── Manual posts ──────────────────────────────────────────────────────────────

export interface ManualPostCreate {
  fake_account_id: string;
  content: string;
  tag?: string;
  image_url?: string;
}

export interface ManualPostOut {
  id: string;
  content: string;
  tag: string;
  image_url: string;
}

export const createManualPost = (data: ManualPostCreate) =>
  apiFetch<ManualPostOut>("/admin/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
