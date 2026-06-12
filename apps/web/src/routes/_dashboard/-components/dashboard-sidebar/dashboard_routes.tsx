import type { SidebarItem } from "@/components/sidebar/types";
import { ClipboardList, LayoutDashboard, RefreshCw } from "lucide-react";

export const dashboard_account_routes = [] satisfies SidebarItem[];

export const dashboard_admin_routes = [
  { title: "Review events", href: "/admin/events", icon: ClipboardList },
] satisfies SidebarItem[];

export function getDashboardPrimaryRoutes(): SidebarItem[] {
  return [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Sync", href: "/sync", icon: RefreshCw },
  ];
}
