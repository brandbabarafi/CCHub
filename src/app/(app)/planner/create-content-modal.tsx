"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createContent } from "@/features/planner/actions";

const PLATFORMS = ["TikTok", "Instagram", "YouTube"];
const CONTENT_TYPES = ["Short Video", "Reel", "Story", "Post", "Thread"];

export function CreateContentModal({
  pillars,
  onClose,
  onCreated,
}: {
  pillars: any[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [contentType, setContentType] = useState("");
  const [pillarId, setPillarId] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [brief, setBrief] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await createContent({ title, platform, contentType, pillarId, publishDate, brief });
    setLoading(false);
    onCreated();
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-soft w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-text-primary">New Content</h2>
          <button onClick={onClose} className="p-1 hover:bg-surface rounded-sm transition-colors">
            <X size={16} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Content title..."
              required
              className="h-10 px-3 rounded-sm border border-border text-sm outline-none focus:border-text-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="h-10 px-3 rounded-sm border border-border text-sm outline-none bg-white"
              >
                <option value="">Select...</option>
                {PLATFORMS.map((p) => <option key={p} value={p.toLowerCase()}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="h-10 px-3 rounded-sm border border-border text-sm outline-none bg-white"
              >
                <option value="">Select...</option>
                {CONTENT_TYPES.map((t) => <option key={t} value={t.toLowerCase()}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Pillar</label>
              <select
                value={pillarId}
                onChange={(e) => setPillarId(e.target.value)}
                className="h-10 px-3 rounded-sm border border-border text-sm outline-none bg-white"
              >
                <option value="">None</option>
                {pillars.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-secondary">Publish Date</label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="h-10 px-3 rounded-sm border border-border text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">Brief</label>
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Content brief..."
              rows={3}
              className="px-3 py-2 rounded-sm border border-border text-sm outline-none resize-none focus:border-text-primary transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-sm border border-border text-sm text-text-secondary hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 rounded-sm bg-text-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}