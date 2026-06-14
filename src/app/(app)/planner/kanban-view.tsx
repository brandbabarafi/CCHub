"use client";

import { updateContentStatus } from "@/features/planner/actions";

const STATUSES = ["idea","research","script","shoot","edit","review","scheduled","published"];

export function KanbanView({ contents, onRefresh }: { contents: any[]; onRefresh: () => void }) {
  async function handleDrop(contentId: string, newStatus: string) {
    await updateContentStatus(contentId, newStatus);
    onRefresh();
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUSES.map((status) => {
        const cols = contents.filter((c) => c.status === status);
        return (
          <div
            key={status}
            className="flex-shrink-0 w-[220px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("contentId");
              if (id) handleDrop(id, status);
            }}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wide capitalize">
                {status}
              </span>
              <span className="text-xs text-text-tertiary bg-surface px-2 py-0.5 rounded-sm">
                {cols.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2 min-h-[100px]">
              {cols.map((c) => (
                <div
                  key={c.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("contentId", c.id)}
                  className="bg-white rounded-sm shadow-soft p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-medium text-text-primary leading-snug">{c.title}</p>
                  {c.platform && (
                    <p className="text-xs text-text-tertiary mt-1 capitalize">{c.platform}</p>
                  )}
                  {c.pillar && (
                    <p className="text-xs text-text-tertiary mt-0.5">{c.pillar.name}</p>
                  )}
                  {c.publishDate && (
                    <p className="text-xs text-text-tertiary mt-1">
                      {new Date(c.publishDate).toLocaleDateString("id-ID")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}