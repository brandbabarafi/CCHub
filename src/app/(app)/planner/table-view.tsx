"use client";

import { updateContentStatus, deleteContent } from "@/features/planner/actions";

const STATUSES = ["idea","research","script","shoot","edit","review","scheduled","published"];

const STATUS_COLORS: Record<string, string> = {
  idea: "bg-gray-100 text-gray-600",
  research: "bg-blue-50 text-blue-600",
  script: "bg-purple-50 text-purple-600",
  shoot: "bg-yellow-50 text-yellow-600",
  edit: "bg-orange-50 text-orange-600",
  review: "bg-pink-50 text-pink-600",
  scheduled: "bg-teal-50 text-teal-600",
  published: "bg-green-50 text-green-600",
};

export function TableView({ contents, onRefresh }: { contents: any[]; onRefresh: () => void }) {
  async function handleStatusChange(id: string, status: string) {
    await updateContentStatus(id, status);
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this content?")) return;
    await deleteContent(id);
    onRefresh();
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-20 text-text-tertiary text-sm">
        No content yet. Click "New Content" to get started.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-divider">
            {["Title", "Platform", "Pillar", "Status", "Publish Date", ""].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-text-tertiary font-medium text-xs uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contents.map((c) => (
            <tr key={c.id} className="border-b border-divider hover:bg-surface transition-colors duration-150">
              <td className="px-4 py-3 text-text-primary font-medium">{c.title}</td>
              <td className="px-4 py-3 text-text-secondary capitalize">{c.platform || "—"}</td>
              <td className="px-4 py-3 text-text-secondary">{c.pillar?.name || "—"}</td>
              <td className="px-4 py-3">
                <select
                  value={c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  className={`text-xs font-medium px-2 py-1 rounded-sm border-0 outline-none cursor-pointer ${STATUS_COLORS[c.status]}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-white text-text-primary capitalize">{s}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {c.publishDate ? new Date(c.publishDate).toLocaleDateString("id-ID") : "—"}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-text-tertiary hover:text-red-500 text-xs transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}