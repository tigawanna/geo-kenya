import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/lib/tanstack/router/use-theme";
import { Moon, Sun } from "lucide-react";

export function DashboardTheme() {
  const { theme, updateTheme } = useTheme();
  const { state, isMobile } = useSidebar();
  const showLabel = state === "expanded" || isMobile;

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={toggleTheme}>
          {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          {showLabel ? <span>{theme === "light" ? "Dark mode" : "Light mode"}</span> : null}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
