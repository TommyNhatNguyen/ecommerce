"use client";

import { ADMIN_ROUTES } from "@/app/constants/routes";
import NotificationContextProvider, {
  useNotification,
} from "@/app/contexts/NotificationContext";
import Logo from "@/app/shared/components/Logo";
import { MenuItem } from "@/app/shared/types/antd.model";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Dropdown,
  Input,
  Layout,
  Menu,
} from "antd";
import {
  FolderOpen,
  Users,
  ShoppingCart,
  Lock,
  Settings,
  Package,
  BarChart,
  LayoutDashboard,
  SquareChevronLeft,
  SquareChevronRight,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { increment } from "@/app/shared/store/reducers/counter";
import { useSocket, useSocketPush } from "@/app/shared/hooks/useSocket";
import { SOCKET_EVENTS_ENDPOINT } from "@/app/constants/socket-endpoint";
import {
  setIsConnected,
  setOrderCreated,
} from "@/app/shared/store/reducers/socket";
import { socketServices } from "@/app/shared/services/sockets";
import { notificationServices } from "@/app/shared/services/notification/notificationService";
const { Header, Footer, Sider, Content } = Layout;
type DashboardLayoutPropsType = {
  children: React.ReactNode;
};

const items: MenuItem[] = [
  {
    key: ADMIN_ROUTES.dashboard,
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    key: ADMIN_ROUTES.orders.index,
    label: "Orders",
    icon: <ShoppingCart size={16} />,
  },
  { key: ADMIN_ROUTES.sales, label: "Sales", icon: <BarChart size={16} /> },
  {
    key: ADMIN_ROUTES.inventory.index,
    label: "Inventory",
    icon: <Package size={16} />,
  },
  {
    key: ADMIN_ROUTES.customers,
    label: "Customers",
    icon: <Users size={16} />,
  },
  {
    key: ADMIN_ROUTES.resources,
    label: "Resources",
    icon: <FolderOpen size={16} />,
  },
  {
    key: ADMIN_ROUTES.permissions,
    label: "Permissions",
    icon: <Lock size={16} />,
  },
];

const dropdownItems: MenuItem[] = [
  {
    key: "1",
    label: "Administrator",
    disabled: true,
  },
  {
    type: "divider",
  },
  { key: "1", label: "Profile", icon: <User size={16} /> },
  { key: "2", label: "Settings", icon: <Settings size={16} /> },
  { key: "3", label: "Logout", icon: <LogOut size={16} /> },
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
  const { notificationApi } = useNotification();
  const currentPath = pathname.split("/").slice(1);
  const { orderCreated } = useAppSelector((state) => state.socket);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleSelect = (key: string) => {
    router.push(key);
  };
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", orderCreated],
    queryFn: () => notificationServices.getList({}),
  });
  // --- ORDER NOTIFICATION ---
  useSocket(
    socketServices.orderIo,
    SOCKET_EVENTS_ENDPOINT.ORDER_CREATED,
    (data: any) => {
      dispatch(setOrderCreated(data));
    },
  );
  useEffect(() => {
    if (orderCreated) {
      notificationApi.success({
        message: "Order created",
        description: orderCreated,
      });
    }
  }, [orderCreated]);
  return (
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
        <Header className="flex items-center justify-between bg-white px-4">
          <Input.Search
            placeholder="Search..."
            style={{ width: 300 }}
            prefix={<Search />}
          />
          <div className="flex items-center gap-4">
            <Badge count={5}>
              <Button type="text" icon={<Bell />} size="small" />
            </Badge>
            <Dropdown
              menu={{
                items: dropdownItems,
              }}
              trigger={["click"]}
            >
              <div className="flex items-center gap-2">
                <Avatar shape="square" icon={<User />} />
                <div className="h-fit">
                  <p className="h-fit font-open-sans-medium">John Doe</p>
                </div>
                <ChevronDown />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Button
          onClick={() =>
            useSocketPush(
              socketServices.orderIo,
              SOCKET_EVENTS_ENDPOINT.ORDER_CREATED,
              JSON.stringify({
                entity_info: {
                  kind: "create",
                  type: "order",
                },
                actor_info_id: "019477ff-deb9-75ac-9ec7-e921166ad393",
                actor_type: "customer",
                message: "Order created",
              }),
            )
          }
        >
          Create Order
        </Button>
        <Content className="mb-4 min-h-screen p-2">
          <h1 className="text-xl font-bold capitalize">
            {currentPath.map((path) => path.toUpperCase()).join(" - ")}
          </h1>
          <Divider />
          {children}
        </Content>
        <Footer className="bg-white text-center">
          @copyright 2023 Nguyen Anh Nhat
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
