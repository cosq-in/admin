"use client";

import { useEffect, useState } from "react";
import { listDeletionRequests, reviewDeletionRequest, DeletionRequest } from "@/lib/api";

export default function DeletionsPage() {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setRequests(await listDeletionRequests());
    } catch {
      setError("Failed to load deletion requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleReview(id: string, approve: boolean) {
    setProcessing(id);
    try {
      await reviewDeletionRequest(id, approve);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError("Failed to process request.");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-goth-purple text-lg">ACCOUNT DELETION REQUESTS</h1>
        <button
          onClick={load}
          className="text-xs text-goth-dim border border-goth-purple/30 px-3 py-1 rounded hover:border-goth-purple transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 text-red-400 text-xs px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-goth-dim text-sm">Loading…</p>
      ) : requests.length === 0 ? (
        <div className="border border-goth-purple/20 bg-goth-panel rounded-lg p-8 text-center">
          <p className="text-goth-dim text-sm">No pending deletion requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="border border-orange-500/30 bg-goth-panel rounded-lg p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-goth-text font-semibold text-sm">@{req.username}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${req.data_only ? "border-goth-purple/40 text-goth-purple" : "border-red-500/40 text-red-400"}`}>
                      {req.data_only ? "Data only" : "Full account"}
                    </span>
                    <span className="text-xs text-goth-dim font-mono">{req.user_id}</span>
                  </div>
                  <div className="text-xs text-goth-dim">
                    Requested: {new Date(req.requested_at).toLocaleString()}
                  </div>
                  {req.reason && (
                    <div className="text-xs text-goth-text/70 italic mt-1">
                      &ldquo;{req.reason}&rdquo;
                    </div>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={processing === req.id}
                    onClick={() => handleReview(req.id, true)}
                    className="px-4 py-1.5 text-xs font-semibold rounded border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                  >
                    {processing === req.id ? "…" : "Approve & Delete"}
                  </button>
                  <button
                    disabled={processing === req.id}
                    onClick={() => handleReview(req.id, false)}
                    className="px-4 py-1.5 text-xs font-semibold rounded border border-goth-purple/40 bg-goth-purple/10 text-goth-dim hover:border-goth-purple transition-colors disabled:opacity-40"
                  >
                    {processing === req.id ? "…" : "Reject"}
                  </button>
                </div>
              </div>

              <div className="text-xs text-goth-dim/50 font-mono">
                Request ID: {req.id}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border border-goth-purple/10 bg-goth-panel/50 rounded p-4 text-xs text-goth-dim space-y-1">
        <p className="font-semibold text-goth-text/60">On approval:</p>
        <p>• Username is changed to <code className="text-goth-purple">deleted_user_&lt;uid&gt;</code></p>
        <p>• Password is cleared (account becomes inaccessible)</p>
        <p>• Posts, comments, and panda state remain but are anonymised under the new username</p>
      </div>
    </div>
  );
}
