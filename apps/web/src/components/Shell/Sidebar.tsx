"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  CalendarCheck2,
  GraduationCap
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    disabled: false,
  },
  {
    title: "Semesters",
    href: "/semesters",
    icon: BookOpen,
    disabled: false,
  },
  {
    title: "Analytics",
    href: "#",
    icon: BarChart3,
    disabled: true,
  },
  {
    title: "Reports",
    href: "#",
    icon: FileText,
    disabled: true,
  },
  {
    title: "Attendance",
    href: "#",
    icon: CalendarCheck2,
    disabled: true,
  },
];

export function SidebarContent() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100 border-r border-zinc-900">
      <div className="flex h-14 items-center border-b border-zinc-900 px-6 font-semibold">
        <Link href="/dashboard" className="flex items-center gap-2 transition-colors hover:text-indigo-400">
          <GraduationCap className="h-6 w-6 text-indigo-500" />
          <span className="text-lg tracking-tight">GradeUnderflow</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href) && item.href !== "#";
            
            return (
              <Link
                key={index}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400"
                    : item.disabled
                    ? "text-zinc-600 cursor-not-allowed opacity-50"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                )}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-indigo-400" : "")} />
                {item.title}
                {item.disabled && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded-sm">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 md:block flex-shrink-0">
      <SidebarContent />
    </aside>
  );
}
