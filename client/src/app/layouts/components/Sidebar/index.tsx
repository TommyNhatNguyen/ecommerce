"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenu,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  ChartLineIcon,
  FileBoxIcon,
  FileTextIcon,
  Home,
  LockKeyholeIcon,
  LogOutIcon,
  PackageIcon,
  Settings,
  UsersIcon,
} from "lucide-react";
import Logo from "@/app/shared/components/Logo";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
const items = [
  {
    title: "Dashboard",
    url: ADMIN_ROUTES.dashboard,
    icon: Home,
  },
  {
    title: "Orders",
    url: ADMIN_ROUTES.orders,
    icon: FileTextIcon,
  },
  {
    title: "Sales",
    url: ADMIN_ROUTES.sales,
    icon: ChartLineIcon,
  },
  {
    title: "Inventory",
    url: ADMIN_ROUTES.inventory,
    icon: PackageIcon,
  },
  {
    title: "Customers",
    url: ADMIN_ROUTES.customers,
    icon: UsersIcon,
  },
  {
    title: "Resources",
    url: ADMIN_ROUTES.resources,
    icon: FileBoxIcon,
  },
];
const setting = [
  {
    title: "Settings",
    url: ADMIN_ROUTES.settings,
    icon: Settings,
  },
  {
    title: "Permissions",
    url: ADMIN_ROUTES.permissions,
    icon: LockKeyholeIcon,
  },
];
type CustomSidebarPropsType = {
  children?: React.ReactNode;
};
const CustomSidebar = ({ children }: CustomSidebarPropsType) => {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <Logo />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {setting.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LogOutIcon />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default CustomSidebar;
