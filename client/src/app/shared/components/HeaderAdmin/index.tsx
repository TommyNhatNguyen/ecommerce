import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import clsx from "clsx";
import Container from "@/app/shared/components/Container";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Logo from "@/app/shared/components/Logo";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const ADMIN_ROUTES = {
  dashboard: "/dashboard",
  orders: "/orders",
  sales: "/sales",
  products: "/products",
  inventory: "/inventory",
  customers: "/customers",
  resources: "/resources",
  settings: "/settings",
};

type HeaderAdminPropsType = {};

const HeaderAdmin = (props: HeaderAdminPropsType) => {
  return (
    <header className="admin-header h-header w-full max-w-full">
      <Container classes="flex items-center justify-between gap-4 py-8">
        <NavigationMenu className={cn("admin-header__nav", "h-full flex items-center justify-between gap-4")}>
          <Logo classes="logo" />
          <Separator orientation="vertical" />
          <NavigationMenuList
            className={cn("admin-header__nav-list", "h-full")}
          >
            {Object.entries(ADMIN_ROUTES).map(([key, value]) => (
              <NavigationMenuItem
                className={cn(navigationMenuTriggerStyle(), "item capitalize")}
                key={key}
              >
                <Link href={value} legacyBehavior passHref>
                  {key}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Separator orientation="vertical" />
        <div
          className={cn(
            "admin-header__search",
            "flex flex-1 items-center justify-center gap-4",
          )}
        >
          <Input className="input" />
          <Avatar className="avatar">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </Container>
    </header>
  );
};

export default HeaderAdmin;
