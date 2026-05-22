export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-pixel text-goth-purple text-lg">CONTROL PANEL</h1>
      <p className="text-goth-dim text-sm">Select a section from the nav to manage BambinoPandalini content.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/prompts", label: "Groq Prompts", desc: "Edit & trigger brainrot generation templates" },
          { href: "/bots", label: "Bot Accounts", desc: "Create & manage fake social accounts" },
          { href: "/quests", label: "Quests & XP", desc: "Configure daily quests and achievement badges" },
          { href: "/events", label: "Events", desc: "Toggle the 3 AM spooky event and other time-limited features" },
          { href: "/posts", label: "Posts & Simulator", desc: "Browse bot posts, select them, and simulate bot comment threads with Groq" },
        ].map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="block p-5 border border-goth-purple/30 rounded-lg bg-goth-panel hover:border-goth-pink transition-colors"
          >
            <div className="text-goth-text font-semibold mb-1">{card.label}</div>
            <div className="text-goth-dim text-xs">{card.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
