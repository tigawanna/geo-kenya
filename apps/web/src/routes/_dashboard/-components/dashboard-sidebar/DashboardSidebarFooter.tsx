import { useSidebar } from "@/components/ui/sidebar";
import { DashboardSidebarUser } from "./DashboardSidebarUser";
import { DashboardTheme } from "./DashboardTheme";

export function DashboardSidebarFooter() {
  const { state, isMobile } = useSidebar();
  const showLabel = state === "expanded" || isMobile;

  return (
    <>
      {showLabel ? <p className="px-2 text-xs text-base-content/60">Admin hub</p> : null}
      <DashboardTheme />
      <DashboardSidebarUser />
    </>
  );
}
