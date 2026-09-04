import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Refrigerator, Snowflake, Package, ShoppingCart, PawPrint } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [{ title: "Home", url: "/home", icon: Home }] as const;

const inventoryItems = [
  { title: "Fridge", url: "/fridge", icon: Refrigerator },
  { title: "Freezer", url: "/freezer", icon: Snowflake },
  { title: "Pantry", url: "/pantry", icon: Package },
] as const;

const otherItems = [
  { title: "Shopping", url: "/shopping", icon: ShoppingCart },
  { title: "Pets", url: "/pets", icon: PawPrint },
] as const;

type Item = { title: string; url: string; icon: typeof Home };

export function AppSidebar() {
  const currentPath = useRouterState({ select: (router) => router.location.pathname });

  const renderGroup = (label: string, items: readonly Item[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {renderGroup("Household", mainItems)}
        {renderGroup("Inventory", inventoryItems)}
        {renderGroup("More", otherItems)}
      </SidebarContent>
    </Sidebar>
  );
}
