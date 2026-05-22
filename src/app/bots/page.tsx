"use client";

import { useEffect, useState } from "react";
import { listBots, createBot, generatePosts, createManualPost, type FakeAccount } from "@/lib/api";

const PERSONALITIES = ["raccoon", "microwave", "frog", "drywall ghost", "sigma entity"];

export default function BotsPage() {
  const [bots, setBots] = useState<FakeAccount[]>([]);
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [personality, setPersonality] = useState("raccoon");
  const [selectedBot, setSelectedBot] = useState("");
  const [genCount, setGenCount] = useState(10);
  const [extraCtx, setExtraCtx] = useState("");
  const [preview, setPreview] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  // Custom post
  const [postBot, setPostBot] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postTag, setPostTag] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postStatus, setPostStatus] = useState("");

  useEffect(() => {
    listBots().then(setBots).catch(console.error);
  }, []);

  async function handleCreate() {
    const bot = await createBot({ handle, display_name: displayName, personality_type: personality });
    setBots((prev) => [...prev, bot]);
    setHandle(""); setDisplayName("");
    setStatus(`Bot @${bot.handle} created.`);
  }

  async function handleManualPost() {
    if (!postBot) { setPostStatus("Select a bot first."); return; }
    if (!postContent.trim()) { setPostStatus("Content is required."); return; }
    setPostStatus("Posting...");
    try {
      const res = await createManualPost({
        fake_account_id: postBot,
        content: postContent.trim(),
        tag: postTag.trim(),
        image_url: postImageUrl.trim(),
      });
      setPostContent(""); setPostTag(""); setPostImageUrl("");
      setPostStatus(`✓ Posted (id: ${res.id.slice(0, 8)}…)`);
    } catch (e) {
      setPostStatus("Error: " + (e as Error).message);
    }
  }

  async function handleGenerate() {
    if (!selectedBot) { setStatus("Select a bot first."); return; }
    setStatus("Generating...");
    const res = await generatePosts(selectedBot, { personality, count: genCount, extra_context: extraCtx });
    setPreview(res.posts.map((p) => `[${p.tag}] ${p.content}`));
    setStatus(`Inserted ${res.inserted} posts.`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="font-pixel text-goth-purple text-sm">BOT ACCOUNTS</h1>

      {/* Create bot */}
      <section className="border border-goth-purple/30 rounded-lg p-5 bg-goth-panel space-y-3">
        <h2 className="text-goth-text font-semibold">Create Bot</h2>
        <div className="grid grid-cols-2 gap-3">
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle"
            className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text" />
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name"
            className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text" />
        </div>
        <select value={personality} onChange={(e) => setPersonality(e.target.value)}
          className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text w-full">
          {PERSONALITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <button onClick={handleCreate}
          className="bg-goth-purple hover:bg-goth-pink transition-colors text-white text-xs px-4 py-2 rounded font-pixel">
          CREATE
        </button>
      </section>

      {/* Bot list */}
      <section className="space-y-2">
        <h2 className="text-goth-text font-semibold">Existing Bots</h2>
        {bots.map((b) => (
          <div key={b.id}
            onClick={() => setSelectedBot(b.id)}
            className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${selectedBot === b.id ? "border-goth-pink bg-goth-panel" : "border-goth-purple/20 bg-goth-surface"}`}>
            <span className="text-goth-cyan text-sm font-mono">@{b.handle}</span>
            <span className="text-goth-dim text-xs">{b.personality_type}</span>
          </div>
        ))}
      </section>

      {/* Custom single post */}
      <section className="border border-goth-pink/40 rounded-lg p-5 bg-goth-panel space-y-3">
        <h2 className="text-goth-text font-semibold">Custom Post from Bot</h2>
        <p className="text-goth-dim text-xs">Select a bot below, write the post, and submit. Image URL is optional.</p>
        <select value={postBot} onChange={(e) => setPostBot(e.target.value)}
          className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text w-full">
          <option value="">— select bot —</option>
          {bots.map((b) => <option key={b.id} value={b.id}>@{b.handle} ({b.personality_type})</option>)}
        </select>
        <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)}
          placeholder="Post content…" rows={3}
          className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text w-full resize-none" />
        <div className="flex gap-3">
          <input value={postTag} onChange={(e) => setPostTag(e.target.value)} placeholder="tag (optional)"
            className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text w-32" />
          <input value={postImageUrl} onChange={(e) => setPostImageUrl(e.target.value)} placeholder="Image URL (optional)"
            className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text flex-1" />
        </div>
        {postImageUrl && (
          <img src={postImageUrl} alt="preview" className="rounded max-h-40 object-cover border border-goth-purple/30" />
        )}
        <button onClick={handleManualPost}
          className="bg-goth-pink hover:bg-goth-purple transition-colors text-white text-xs px-4 py-2 rounded font-pixel">
          POST NOW
        </button>
        {postStatus && <p className="text-goth-cyan text-xs font-mono">{postStatus}</p>}
      </section>

      {/* Generate posts */}
      <section className="border border-goth-purple/30 rounded-lg p-5 bg-goth-panel space-y-3">
        <h2 className="text-goth-text font-semibold">Generate Posts (Groq)</h2>
        <div className="flex gap-3">
          <input type="number" value={genCount} min={1} max={50} onChange={(e) => setGenCount(Number(e.target.value))}
            className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text w-20" />
          <input value={extraCtx} onChange={(e) => setExtraCtx(e.target.value)} placeholder="Extra context (optional)"
            className="bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text flex-1" />
        </div>
        <button onClick={handleGenerate}
          className="bg-goth-pink hover:bg-goth-purple transition-colors text-white text-xs px-4 py-2 rounded font-pixel">
          GENERATE & INSERT
        </button>
        {status && <p className="text-goth-cyan text-xs font-mono">{status}</p>}
        <ul className="space-y-1 max-h-64 overflow-y-auto">
          {preview.map((line, i) => (
            <li key={i} className="text-goth-dim text-xs font-mono border-b border-goth-purple/10 py-1">{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
