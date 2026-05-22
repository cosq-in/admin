const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/gothicco";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export interface AdminPost {
  id: string;
  content: string;
  tag: string;
  image_url: string;
  bot_handle: string;
  bot_display_name: string;
  bot_id: string;
  comments_count: number;
  created_at: string;
}

export interface SimulatedComment {
  post_id: string;
  bot_id: string;
  bot_handle: string;
  content: string;
}

export interface SimulateResponse {
  inserted: number;
  comments: SimulatedComment[];
}

export function listBotPosts(botIds?: string[]): Promise<AdminPost[]> {
  const params = botIds && botIds.length > 0
    ? "?" + botIds.map((id) => `bot_id=${encodeURIComponent(id)}`).join("&")
    : "";
  return apiFetch<AdminPost[]>(`/admin/posts${params}`);
}

export function simulateInteractions(postIds: string[], botIds: string[]): Promise<SimulateResponse> {
  return apiFetch<SimulateResponse>("/admin/simulate", {
    method: "POST",
    body: JSON.stringify({ post_ids: postIds, bot_ids: botIds }),
  });
}
