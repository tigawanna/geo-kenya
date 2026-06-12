import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SidebarItem } from "./types";

interface SidebarLinksProps {
  links: SidebarItem[];
  isNested?: boolean;
}

function normalizeSidebarPath(path: string): string {
  const base = path.split("?")[0] ?? "";
  if (base.length > 1 && base.endsWith("/")) return base.slice(0, -1);
  return base || "/";
}

function sidebarHrefMatchesPathname(pathname: string, href: string, fuzzy: boolean): boolean {
  const p = normalizeSidebarPath(pathname);
  const h = normalizeSidebarPath(href);
  if (p === h) return true;
  if (!fuzzy || h === "/") return false;
  return p.startsWith(`${h}/`);
}

export function SidebarLinks({ links, isNested = false }: SidebarLinksProps) {
  const { state } = useSidebar();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const showTooltips = state === "collapsed";

  const routeMatches = (href: string): boolean => sidebarHrefMatchesPathname(pathname, href, true);

  if (links.length === 0) {
    return null;
  }

  const Container = isNested ? SidebarMenuSub : SidebarMenu;

  return (
    <Container>
      {links.map((item) => {
        if (item.sublinks && item.sublinks.length > 0) {
          const sectionOpenDefault =
            item.sublinks.some((sub) => routeMatches(sub.href)) || Boolean(item.isActive);
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={sectionOpenDefault}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {showTooltips ? (
                  <TooltipProvider>
                    <Tooltip delayDuration={200}>
                      <CollapsibleTrigger asChild>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton isActive={sectionOpenDefault}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </TooltipTrigger>
                      </CollapsibleTrigger>
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={sectionOpenDefault}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                )}
                <CollapsibleContent>
                  <SidebarLinks links={item.sublinks} isNested={true} />
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        const isActive = routeMatches(item.href);

        return (
          <SidebarMenuItem key={item.title}>
            {showTooltips ? (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        );
      })}
    </Container>
  );
}
