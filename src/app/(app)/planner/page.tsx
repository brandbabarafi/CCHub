"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getContents, getPillars } from "@/features/planner/actions";
import { TableView } from "./table-view";
import { KanbanView } from "./kanban-view";
import { CreateContentModal } from "./create-content-modal";

type View = "table" | "kanban";

export default function PlannerPage() {
  const [view, setView] = useState<View>("table");
  const [contents, setContents] = useState<any[]>([]);
  const [pillars, setPillars] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [c, p] = await Promise.all([getContents(), getPillars()]);
    setContents(c);
    setPillars(p);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Content Planner</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 h-10 px-4 bg-text-primary text-white text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Content
        </button>
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-surface rounded-sm p-1 w-fit">
        {(["table", "kanban"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors duration-150 capitalize ${
              view === v
                ? "bg-white text-text-primary shadow-soft"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-text-tertiary text-sm">Loading...</div>
      ) : view === "table" ? (
        <TableView contents={contents} onRefresh={load} />
      ) : (
        <KanbanView contents={contents} onRefresh={load} />
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateContentModal
          pillars={pillars}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}