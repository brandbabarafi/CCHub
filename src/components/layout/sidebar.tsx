"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Lightbulb,
  Radar,
  Brain,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/inspiration", label: "Inspiration", icon: Lightbulb },
  { href: "/trends", label: "Trend Radar", icon: Radar },
  { href: "/hooks", label: "Hook Intelligence", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] border-r border-border flex flex-col py-6 px-3 sticky top-0 h-screen">
      <div className="px-3 mb-8">
        <span className="text-lg font-semibold text-text-primary">Content OS</span>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors duration-150 ${
                active
                  ? "bg-surface-hover text-text-primary font-medium"
                  : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}