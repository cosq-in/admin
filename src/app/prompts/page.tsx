"use client";

import { useState } from "react";

const DEFAULT_PROMPT = `Generate {count} absurd brainrot social media posts in JSON format.
The author is a {personality}.
Include topics like drywall, crying at microwaves, late-night refrigeration, sigma rituals.
Format: [{ "content": "...", "tag": "..." }]`;

export default function PromptsPage() {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    localStorage.setItem("brainrot_prompt_template", prompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-pixel text-goth-purple text-sm">GROQ PROMPT TEMPLATES</h1>

      <div className="border border-goth-purple/30 rounded-lg p-5 bg-goth-panel space-y-3">
        <p className="text-goth-dim text-xs">
          Edit the base prompt sent to Groq. Use <code className="text-goth-cyan">{"{count}"}</code> and{" "}
          <code className="text-goth-cyan">{"{personality}"}</code> as placeholders.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          className="w-full bg-goth-surface border border-goth-purple/40 rounded px-3 py-2 text-sm text-goth-text font-mono resize-none"
        />
        <button
          onClick={handleSave}
          className="bg-goth-purple hover:bg-goth-pink transition-colors text-white text-xs px-4 py-2 rounded font-pixel"
        >
          {saved ? "SAVED!" : "SAVE TEMPLATE"}
        </button>
      </div>
    </div>
  );
}
