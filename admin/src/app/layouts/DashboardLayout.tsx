"use client";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import NotificationContextProvider, {
  useNotification,
} from "@/app/contexts/NotificationContext";
import Logo from "@/app/shared/components/Logo";
import { MenuItem } from "@/app/shared/types/antd.model";
import { Breadcrumb, Divider, Layout, Menu } from "antd";
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
  House,
  NotebookPenIcon,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import { getUserInfo } from "@/app/shared/store/reducers/auth";
import OrderNotification from "@/app/layouts/components/OrderNotification";
import { useSocketNotifications } from "@/app/layouts/hooks/useSocketNotification";
import { IntlProvider, useIntl } from "react-intl";
import { useLanguage } from "@/app/shared/hooks/useLanguage";
import { LOCALES } from "@/app/shared/translation/locales";
import { HeaderSection } from "@/app/layouts/components/HeaderSection";

const { Footer, Sider, Content } = Layout;

type DashboardLayoutPropsType = {
  children: React.ReactNode;
};

export const DashboardWrapper = ({ children }: DashboardLayoutPropsType) => {
  const queryClient = new QueryClient();
  const { messages, locale } = useLanguage();

  return (
    //@ts-ignore
    <IntlProvider
      messages={messages}
      locale={locale}
      defaultLocale={LOCALES.ENGLISH}
    >
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </NotificationContextProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
};

const DashboardLayout = ({ children }: DashboardLayoutPropsType) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname.split("/").slice(1);
  const intl = useIntl();
  const { notificationApi } = useNotification();
  const { orderCreated, inventoryLowInventory } = useAppSelector(
    (state) => state.socket,
  );

  const menuItems: MenuItem[] = [
    {
      key: ADMIN_ROUTES.dashboard,
      label: `${intl.formatMessage({ id: "dashboard" })} (${intl.formatMessage({ id: "coming_soon" })})`,
      icon: <LayoutDashboard size={16} />,
      disabled: true,
    },
    {
      key: ADMIN_ROUTES.chat,
      label: intl.formatMessage({ id: "chat" }),
      icon: <MessageCircle size={16} />,
    },
    {
      key: ADMIN_ROUTES.orders.index,
      label: intl.formatMessage({ id: "orders" }),
      icon: <ShoppingCart size={16} />,
    },
    {
      key: ADMIN_ROUTES.sales,
      label: `${intl.formatMessage({ id: "sales" })} (${intl.formatMessage({ id: "coming_soon" })})`,
      icon: <BarChart size={16} />,
      disabled: true,
    },
    {
      key: ADMIN_ROUTES.inventory.index,
      label: intl.formatMessage({ id: "inventory_management" }),
      icon: <House size={16} />,
      children: [
        {
          key: ADMIN_ROUTES.inventory.products.index,
          label: intl.formatMessage({ id: "products" }),
          icon: <Package size={16} />,
        },
        {
          key: ADMIN_ROUTES.inventory.index,
          label: intl.formatMessage({ id: "inventory" }),
          icon: <NotebookPenIcon size={16} />,
        },
        {
          key: ADMIN_ROUTES.inventory.settings,
          label: intl.formatMessage({ id: "settings" }),
          icon: <Settings size={16} />,
        },
      ],
    },
    {
      key: ADMIN_ROUTES.customers,
      label: `${intl.formatMessage({ id: "customers" })} (${intl.formatMessage({ id: "coming_soon" })})`,
      icon: <Users size={16} />,
      disabled: true,
    },
    {
      key: ADMIN_ROUTES.resources,
      label: intl.formatMessage({ id: "resources" }),
      icon: <FolderOpen size={16} />,
    },
    {
      key: ADMIN_ROUTES.permissions.index,
      label: intl.formatMessage({ id: "permissions" }),
      icon: <Lock size={16} />,
    },
    {
      key: ADMIN_ROUTES.website,
      label: intl.formatMessage({ id: "website" }),
      icon: <Globe size={16} />,
    },
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleSelect = (key: string) => {
    console.log(key);
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
        description: `${inventoryLowInventory.product_sellable.variant?.name} is running out of stock: ${inventoryLowInventory.inventory_warehouse.quantity} left`,
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
            items={menuItems}
            inlineCollapsed={collapsed}
            selectedKeys={[`/${pathname.split("/").slice(1).join("/")}`]}
            onSelect={(e) => handleSelect(e.key)}
            mode="inline"
          />
        </Sider>
        <Layout>
          <HeaderSection />
          <Content className="mb-4 gap-4 p-2">
            {/* <Breadcrumb
              items={currentPath.slice(1).map((path) => ({
                title: intl.formatMessage({ id: path }),
              }))}
              separator=">"
              className="mb-4"
            /> */}
            {children}
          </Content>
          {/* <Footer className="text-center">
            @copyright 2023 Nguyen Anh Nhat
          </Footer> */}
        </Layout>
      </Layout>
    </>
  );
};

export default DashboardLayout;
