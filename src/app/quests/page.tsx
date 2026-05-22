"use client";

const SAMPLE_QUESTS = [
  { title: "First Post", type: "post_count", target: 1, xp: 50 },
  { title: "Ratio Master", type: "ratio_fake", target: 3, xp: 150 },
  { title: "Made Bambino Laugh", type: "make_laugh", target: 1, xp: 200 },
  { title: "Rotmaxxer", type: "post_count", target: 10, xp: 500 },
  { title: "Drywall Consumer", type: "post_count", target: 25, xp: 1000 },
];

export default function QuestsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-pixel text-goth-purple text-sm">QUESTS & ACHIEVEMENTS</h1>

      <div className="border border-goth-purple/30 rounded-lg p-5 bg-goth-panel space-y-3">
        <h2 className="text-goth-text font-semibold text-sm">Active Quests</h2>
        <table className="w-full text-xs text-goth-text">
          <thead>
            <tr className="border-b border-goth-purple/20 text-goth-dim">
              <th className="text-left py-2">Title</th>
              <th className="text-left py-2">Type</th>
              <th className="text-right py-2">Target</th>
              <th className="text-right py-2">XP</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_QUESTS.map((q, i) => (
              <tr key={i} className="border-b border-goth-purple/10 hover:bg-goth-surface transition-colors">
                <td className="py-2 text-goth-cyan font-mono">{q.title}</td>
                <td className="py-2 text-goth-dim">{q.type}</td>
                <td className="py-2 text-right">{q.target}</td>
                <td className="py-2 text-right text-goth-pink">+{q.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-goth-dim text-xs">Quest CRUD endpoints are on the roadmap (Phase 5).</p>
      </div>
    </div>
  );
}
