"use client";

import { useEffect, useState } from "react";
import { get3amEvent, set3amEvent } from "@/lib/api";

export default function EventsPage() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    get3amEvent()
      .then((s) => {
        setEnabled(s.enabled);
        setMessage(s.message);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(nextEnabled: boolean, nextMessage: string) {
    setSaving(true);
    setSaved(false);
    try {
      const result = await set3amEvent(nextEnabled, nextMessage);
      setEnabled(result.enabled);
      setMessage(result.message);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-pixel text-goth-purple text-lg">EVENTS</h1>

      <div className="border border-goth-purple/30 rounded-lg bg-goth-panel p-6 space-y-5">

        {/* Toggle row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-goth-text font-semibold mb-1">3 AM Event</div>
            <div className="text-goth-dim text-xs leading-relaxed">
              When enabled, the banner below appears in the Cursed Stream feed.
              Toggle off to hide it instantly.
            </div>
          </div>
          <button
            onClick={() => save(!enabled, message)}
            disabled={loading || saving}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none
              ${enabled ? "bg-goth-pink border-goth-pink/70" : "bg-goth-bg border-goth-purple/40"}
              ${saving || loading ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-pressed={enabled}
          >
            <span
              className={`inline-block h-5 w-5 mt-px ml-px rounded-full bg-white shadow transition-transform duration-200
                ${enabled ? "translate-x-5" : "translate-x-0"}`}
            />
          </button>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium
              ${enabled
                ? "bg-goth-pink/10 text-goth-pink border border-goth-pink/30"
                : "bg-goth-purple/10 text-goth-dim border border-goth-purple/20"
              }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-goth-pink animate-pulse" : "bg-goth-dim"}`} />
            {loading ? "LOADING…" : enabled ? "ACTIVE" : "INACTIVE"}
          </span>
          {saved && <span className="text-xs text-goth-dim">✓ saved</span>}
        </div>

        {/* Divider */}
        <div className="border-t border-goth-purple/20" />

        {/* Banner message editor */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-goth-dim uppercase tracking-widest">
            Banner Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            placeholder="👻 3 AM EVENT — SPOOKY POSTS UNLOCKED"
            className="w-full bg-goth-bg border border-goth-purple/30 rounded px-3 py-2 text-goth-text text-sm placeholder:text-goth-dim/40 focus:outline-none focus:border-goth-purple transition-colors"
          />
          <p className="text-xs text-goth-dim/60">
            This text is displayed verbatim in the pink banner at the top of the feed.
            Emojis, caps, slashes — all fair game.
          </p>
        </div>

        {/* Save button */}
        <button
          onClick={() => save(enabled, message)}
          disabled={saving || loading}
          className="w-full py-2 rounded border border-goth-purple/40 bg-goth-purple/10 text-goth-purple text-sm font-semibold hover:bg-goth-purple/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "SAVING…" : "SAVE MESSAGE"}
        </button>

        {/* Live preview */}
        {(message || enabled) && (
          <div className="space-y-1">
            <p className="text-xs text-goth-dim/60 uppercase tracking-widest">Preview</p>
            <div
              className="w-full py-2 px-4 rounded text-center text-xs font-bold tracking-widest"
              style={{
                background: "linear-gradient(90deg, #1A0030, rgba(255,73,219,0.18), #1A0030)",
                border: "1px solid rgba(255,73,219,0.53)",
                color: "#ff49db",
                textShadow: "0 0 10px rgba(255,73,219,0.8)",
              }}
            >
              {message || "👻 3 AM EVENT — SPOOKY POSTS UNLOCKED"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
