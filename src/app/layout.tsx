import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BambinoPandalini Admin",
  description: "Brainrot control panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-goth-bg text-goth-text min-h-screen font-sans antialiased">
        <nav className="border-b border-goth-purple/30 px-6 py-3 flex items-center gap-6">
          <span className="font-pixel text-goth-purple text-xs tracking-tight">BAMBINO ADMIN</span>
          <a href="/" className="text-goth-dim hover:text-goth-text text-sm">Dashboard</a>
          <a href="/prompts" className="text-goth-dim hover:text-goth-text text-sm">Prompts</a>
          <a href="/bots" className="text-goth-dim hover:text-goth-text text-sm">Bots</a>
          <a href="/quests" className="text-goth-dim hover:text-goth-text text-sm">Quests</a>
          <a href="/events" className="text-goth-dim hover:text-goth-text text-sm">Events</a>
          <a href="/posts" className="text-goth-dim hover:text-goth-text text-sm">Posts</a>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
