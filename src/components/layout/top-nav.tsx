import { Search, Bell } from "lucide-react";

export function TopNav() {
  return (
    <header className="h-16 border-b border-divider sticky top-0 bg-white/80 backdrop-blur-sm z-10 flex items-center px-6 justify-between">
      <div className="flex items-center gap-2 bg-surface rounded-sm px-4 h-10 w-[320px]">
        <Search size={16} className="text-text-tertiary" />
        <input
          placeholder="Search..."
          className="bg-transparent outline-none text-sm w-full placeholder:text-text-tertiary"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-surface transition-colors duration-150">
          <Bell size={18} className="text-text-secondary" strokeWidth={1.75} />
        </button>
        <div className="w-9 h-9 rounded-full bg-text-primary" />
      </div>
    </header>
  );
}