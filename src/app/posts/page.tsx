"use client";

import { useEffect, useState, useCallback } from "react";
import { listBots, type FakeAccount } from "@/lib/api";
import { listBotPosts, simulateInteractions, type AdminPost, type SimulatedComment } from "@/lib/postsApi";

export default function PostsPage() {
  const [bots, setBots] = useState<FakeAccount[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [filterBotIds, setFilterBotIds] = useState<Set<string>>(new Set());
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
  const [simulateBotIds, setSimulateBotIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulatedComment[] | null>(null);
  const [simStatus, setSimStatus] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listBotPosts(filterBotIds.size > 0 ? [...filterBotIds] : undefined);
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, [filterBotIds]);

  useEffect(() => {
    listBots().then(setBots).catch(console.error);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function toggleBotFilter(id: string) {
    setFilterBotIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setSelectedPostIds(new Set());
  }

  function togglePostSelect(id: string) {
    setSelectedPostIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSimBot(id: string) {
    setSimulateBotIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedPostIds(new Set(posts.map((p) => p.id)));
  }

  function clearSelection() {
    setSelectedPostIds(new Set());
  }

  async function handleSimulate() {
    if (selectedPostIds.size === 0) {
      setSimStatus("Select at least one post.");
      return;
    }
    setSimulating(true);
    setSimResult(null);
    setSimStatus("Generating conversation thread with Groq…");
    try {
      const res = await simulateInteractions(
        [...selectedPostIds],
        simulateBotIds.size > 0 ? [...simulateBotIds] : [],
      );
      setSimResult(res.comments);
      setSimStatus(`✓ Inserted ${res.inserted} comments across ${selectedPostIds.size} post(s).`);
      fetchPosts();
    } catch (e) {
      setSimStatus("Error: " + (e as Error).message);
    } finally {
      setSimulating(false);
    }
  }

  const botById = Object.fromEntries(bots.map((b) => [b.id, b]));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="font-pixel text-goth-purple text-sm">BOT POSTS</h1>

      {/* Bot filter chips */}
      <section className="flex flex-wrap gap-2">
        {bots.map((b) => (
          <button
            key={b.id}
            onClick={() => toggleBotFilter(b.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
              filterBotIds.has(b.id)
                ? "border-goth-pink bg-goth-pink/20 text-goth-pink"
                : "border-goth-purple/30 bg-goth-surface text-goth-dim hover:border-goth-purple"
            }`}
          >
            @{b.handle}
          </button>
        ))}
        {filterBotIds.size > 0 && (
          <button onClick={() => setFilterBotIds(new Set())}
            className="px-3 py-1 rounded-full text-xs font-mono border border-goth-dim/30 text-goth-dim hover:border-goth-dim">
            clear filter ✕
          </button>
        )}
      </section>

      {/* Simulate panel */}
      <section className="border border-goth-purple/40 rounded-lg p-5 bg-goth-panel space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-goth-text font-semibold">Simulate Interactions</h2>
          <span className="text-goth-dim text-xs font-mono">
            {selectedPostIds.size} post{selectedPostIds.size !== 1 ? "s" : ""} selected
          </span>
        </div>

        <p className="text-goth-dim text-xs">
          Select posts below, choose which bots participate (empty = all bots), then hit simulate.
          Groq will generate a chronological comment thread and insert it.
        </p>

        {/* Bot participation selector */}
        <div>
          <p className="text-goth-dim text-xs mb-2 font-mono uppercase tracking-wider">Participating bots (empty = all)</p>
          <div className="flex flex-wrap gap-2">
            {bots.map((b) => (
              <button
                key={b.id}
                onClick={() => toggleSimBot(b.id)}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
                  simulateBotIds.has(b.id)
                    ? "border-goth-cyan bg-goth-cyan/15 text-goth-cyan"
                    : "border-goth-purple/30 bg-goth-surface text-goth-dim hover:border-goth-purple"
                }`}
              >
                @{b.handle}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <button
            onClick={handleSimulate}
            disabled={simulating || selectedPostIds.size === 0}
            className="bg-goth-purple hover:bg-goth-pink disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white text-xs px-5 py-2 rounded font-pixel"
          >
            {simulating ? "SIMULATING…" : "SIMULATE INTERACTIONS"}
          </button>
          <button onClick={selectAll} className="text-goth-dim text-xs hover:text-goth-text font-mono underline">
            select all
          </button>
          <button onClick={clearSelection} className="text-goth-dim text-xs hover:text-goth-text font-mono underline">
            clear
          </button>
        </div>

        {simStatus && (
          <p className={`text-xs font-mono ${simStatus.startsWith("✓") ? "text-goth-cyan" : "text-goth-pink"}`}>
            {simStatus}
          </p>
        )}

        {/* Thread preview */}
        {simResult && simResult.length > 0 && (
          <div className="space-y-1 max-h-72 overflow-y-auto border border-goth-purple/20 rounded p-3 bg-goth-surface">
            <p className="text-goth-dim text-xs font-mono uppercase tracking-wider mb-2">Generated thread</p>
            {simResult.map((c, i) => (
              <div key={i} className="py-1.5 border-b border-goth-purple/10 last:border-0">
                <span className="text-goth-pink text-xs font-mono">@{c.bot_handle}</span>
                <span className="text-goth-dim text-xs font-mono mx-1">→</span>
                <span className="text-goth-dim text-[10px] font-mono">post:{c.post_id.slice(0, 8)}…</span>
                <p className="text-goth-text text-xs mt-0.5">{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Posts grid */}
      {loading ? (
        <div className="text-goth-dim text-sm font-mono text-center py-12">loading posts…</div>
      ) : posts.length === 0 ? (
        <div className="text-goth-dim text-sm font-mono text-center py-12">no bot posts found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {posts.map((p) => (
            <div
              key={p.id}
              onClick={() => togglePostSelect(p.id)}
              className={`relative cursor-pointer rounded-lg border p-4 transition-all bg-goth-surface ${
                selectedPostIds.has(p.id)
                  ? "border-goth-pink shadow-[0_0_8px_rgba(236,72,153,0.3)]"
                  : "border-goth-purple/20 hover:border-goth-purple/50"
              }`}
            >
              {/* Selection indicator */}
              <div className={`absolute top-3 right-3 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                selectedPostIds.has(p.id)
                  ? "border-goth-pink bg-goth-pink"
                  : "border-goth-purple/30"
              }`}>
                {selectedPostIds.has(p.id) && <span className="text-white text-[10px] leading-none">✓</span>}
              </div>

              {/* Bot info */}
              <div className="flex items-center gap-2 mb-2 pr-6">
                <span className="text-goth-cyan text-xs font-mono">@{p.bot_handle}</span>
                {p.tag && (
                  <span className="text-goth-dim text-[10px] font-mono border border-goth-purple/30 px-1.5 py-0.5 rounded">
                    {p.tag}
                  </span>
                )}
              </div>

              {/* Image */}
              {p.image_url && (
                <img src={p.image_url} alt="" className="w-full h-28 object-cover rounded mb-2 border border-goth-purple/20" />
              )}

              {/* Content */}
              <p className="text-goth-text text-xs leading-relaxed line-clamp-3">{p.content}</p>

              {/* Footer */}
              <div className="flex gap-3 mt-2">
                <span className="text-goth-dim text-[10px] font-mono">💬 {p.comments_count}</span>
                <span className="text-goth-dim text-[10px] font-mono">{p.created_at.slice(0, 10)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
