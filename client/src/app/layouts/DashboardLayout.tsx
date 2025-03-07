"use client";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import NotificationContextProvider, {
  useNotification,
} from "@/app/contexts/NotificationContext";
import Logo from "@/app/shared/components/Logo";
import { MenuItem } from "@/app/shared/types/antd.model";
import { Divider, Layout, Menu } from "antd";
import {
  FolderOpen,
  Users,
  ShoppingCart,
  Lock,
  Package,
  BarChart,
  LayoutDashboard,
  SquareChevronLeft,
  SquareChevronRight,
  Book,
  Globe,
  MessageCircle,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import { getUserInfo } from "@/app/shared/store/reducers/auth";
import OrderNotification from "@/app/layouts/components/OrderNotification";
import { useSocketNotifications } from "@/app/layouts/hooks/useSocketNotification";
import { HeaderSection } from "@/app/layouts/components/HeaderSection";
import { createPortal } from "react-dom";
import SettingModal from "@/app/shared/components/GeneralModal/components/SettingModal";
import { useSettingModal } from "@/app/layouts/hooks/useSettingModal";
const { Footer, Sider, Content } = Layout;
type DashboardLayoutPropsType = {
  children: React.ReactNode;
};

const items: MenuItem[] = [
  {
    key: ADMIN_ROUTES.dashboard,
    label: "Dashboard (Coming soon)",
    icon: <LayoutDashboard size={16} />,
    disabled: true,
  },
  {
    key: ADMIN_ROUTES.chat,
    label: "Chat",
    icon: <MessageCircle size={16} />,
  },
  {
    key: ADMIN_ROUTES.orders.index,
    label: "Orders",
    icon: <ShoppingCart size={16} />,
  },
  {
    key: ADMIN_ROUTES.sales,
    label: "Sales (Coming soon)",
    icon: <BarChart size={16} />,
    disabled: true,
  },
  {
    key: ADMIN_ROUTES.inventory.index,
    label: "Inventory",
    icon: <Package size={16} />,
  },
  {
    key: ADMIN_ROUTES.customers,
    label: "Customers (Coming soon)",
    icon: <Users size={16} />,
    disabled: true,
  },
  {
    key: ADMIN_ROUTES.blogs.index,
    label: "Blogs",
    icon: <Book size={16} />,
  },
  {
    key: ADMIN_ROUTES.resources,
    label: "Resources",
    icon: <FolderOpen size={16} />,
  },
  {
    key: ADMIN_ROUTES.permissions.index,
    label: "Permissions",
    icon: <Lock size={16} />,
  },
  {
    key: ADMIN_ROUTES.website,
    label: "Website setting",
    icon: <Globe size={16} />,
  },
];

export const DashboardWrapper = ({ children }: DashboardLayoutPropsType) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </NotificationContextProvider>
    </QueryClientProvider>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutPropsType) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname.split("/").slice(1);
  const { notificationApi } = useNotification();
  const { orderCreated, inventoryLowInventory } = useAppSelector(
    (state) => state.socket,
  );
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleSelect = (key: string) => {
    router.push(key);
  };
  // Handle socket notifications
  useSocketNotifications(pathname, notificationApi);
  // Handle notifications display
  const { notificationList } = useAppSelector((state) => state.notification);
  useEffect(() => {
    if (notificationList.count_unread > 0) {
      const hasShownNotification = sessionStorage.getItem(
        "hasShownNotification",
      );
      if (!hasShownNotification) {
        notificationApi.info({
          message: "You have new notifications",
          description: `${notificationList.count_unread} new notifications`,
        });
        sessionStorage.setItem("hasShownNotification", "true");
      }
    }
  }, [notificationList]);
  // Handle order/inventory notifications
  useEffect(() => {
    if (orderCreated?.created_at) {
      notificationApi.success({
        message: <OrderNotification.Title href={ADMIN_ROUTES.orders.index} />,
        description: (
          <OrderNotification
            orderCreated={orderCreated}
            href={ADMIN_ROUTES.orders.index}
          />
        ),
      });
    }
    if (inventoryLowInventory?.created_at) {
      notificationApi.success({
        message: `Inventory Is Low`,
        description: `${inventoryLowInventory.product_sellable.variant?.name} is running out of stock: ${inventoryLowInventory.quantity} left`,
      });
    }
  }, [orderCreated, inventoryLowInventory]);

  // Check authentication
  useEffect(() => {
    if (cookiesStorage.getToken()) {
      dispatch(getUserInfo());
    } else {
      router.push(ADMIN_ROUTES.login);
    }
  }, []);
  return (
    <>
      <Layout className="h-screen">
        <Sider className="bg-white" collapsed={collapsed}>
          <div className="flex items-center justify-between gap-2 p-2">
            <Logo />
            <button onClick={toggleCollapsed}>
              {collapsed ? <SquareChevronLeft /> : <SquareChevronRight />}
            </button>
          </div>
          <Divider variant="dashed" />
          <Menu
            items={items}
            inlineCollapsed={collapsed}
            selectedKeys={[`/${pathname.split("/").slice(1, 3).join("/")}`]}
            onSelect={(e) => handleSelect(e.key)}
            mode="inline"
          />
        </Sider>
        <Layout>
          <HeaderSection />
          <Content className="mb-4 gap-4 overflow-y-auto overflow-x-hidden p-2">
            <div className="mb-4 rounded-lg bg-white px-4 py-2">
              <h1 className="text-xl font-bold capitalize">
                {currentPath.map((path) => path.toUpperCase()).join(" - ")}
              </h1>
            </div>
            {children}
          </Content>
          <Footer className="text-center">
            @copyright 2023 Nguyen Anh Nhat
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};

export default DashboardLayout;
