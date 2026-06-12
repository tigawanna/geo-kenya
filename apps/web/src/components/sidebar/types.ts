import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isActive?: boolean;
  sublinks?: SidebarItem[];
};
