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
import Notification from "@/app/layouts/components/Notification";
import { getNotificationThunk } from "@/app/shared/store/reducers/notification";
import { cookiesStorage } from "@/app/shared/utils/localStorage";
import { getUserInfo, logout } from "@/app/shared/store/reducers/auth";
import { defaultImage } from "@/app/shared/resources/images/default-image";
const { Header, Footer, Sider, Content } = Layout;
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
    key: ADMIN_ROUTES.resources,
    label: "Resources",
    icon: <FolderOpen size={16} />,
  },
  {
    key: ADMIN_ROUTES.permissions.index,
    label: "Permissions",
    icon: <Lock size={16} />,
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
  const { notificationApi } = useNotification();
  const currentPath = pathname.split("/").slice(1);
  const { orderCreated } = useAppSelector((state) => state.socket);
  const { userInfo } = useAppSelector((state) => state.auth);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleSelect = (key: string) => {
    router.push(key);
  };
  const _onLogout = () => {
    dispatch(logout());
    router.push(ADMIN_ROUTES.login);
  };
  const dropdownItems: MenuItem[] = [
    // {
    //   key: "1",
    //   label: "Administrator",
    //   disabled: true,
    // },
    // {
    //   type: "divider",
    // },
    // { key: "1", label: "Profile", icon: <User size={16} /> },
    // { key: "2", label: "Settings", icon: <Settings size={16} /> },
    {
      key: "3",
      label: "Logout",
      icon: <LogOut size={16} />,
      onClick: _onLogout,
    },
  ];
  // --- ORDER NOTIFICATION ---
  useSocket(
    socketServices.orderIo,
    SOCKET_EVENTS_ENDPOINT.ORDER_CREATED,
    (data: any) => {
      console.log("order created", data);
      dispatch(setOrderCreated(data));
    },
  );
  useEffect(() => {
    if (orderCreated) {
      notificationApi.success({
        message: "Order created",
        description: orderCreated,
      });
      dispatch(getNotificationThunk({}));
    }
  }, [orderCreated]);
  useEffect(() => {
    dispatch(getNotificationThunk({}));
  }, []);
  useEffect(() => {
    // If login, then get user info
    if (cookiesStorage.getToken()) {
      dispatch(getUserInfo());
    } else {
      router.push(ADMIN_ROUTES.login);
    }
  }, []);
  return (
    <Layout  className="h-screen" >
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
      <Layout >
        <Header className="flex items-center justify-between bg-white px-4">
          <Input.Search
            placeholder="Search..."
            style={{ width: 300 }}
            prefix={<Search />}
          />
          <div className="flex items-center gap-4">
            <Notification />
            <Dropdown
              menu={{
                items: dropdownItems,
              }}
              trigger={["click"]}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Avatar
                  shape="square"
                  src={userInfo?.image?.url || defaultImage}
                />
                <div className="h-fit">
                  <p className="font-semibold leading-none">
                    {userInfo?.username}
                  </p>
                  <p className="leading-none">{userInfo?.email}</p>
                </div>
                <ChevronDown />
              </div>
            </Dropdown>
          </div>
        </Header>
        {/* <Button
          onClick={() =>
            useSocketPush(
              socketServices.orderIo,
              SOCKET_EVENTS_ENDPOINT.ORDER_CREATED,
              JSON.stringify({
                entity_info: {
                  kind: "create",
                  type: "order",
                },
                actor_info_id: "0194b65d-b3de-71bc-9e42-8becb989a0f3",
                actor_type: "customer",
                message: "Order created",
              }),
            )
          }
        >
          Create Order
        </Button> */}
        <Content  className="mb-4 overflow-y-auto overflow-x-hidden p-2">
          <div className="mb-4 rounded-lg bg-white px-4 py-2">
            <h1 className="text-xl font-bold capitalize">
              {currentPath.map((path) => path.toUpperCase()).join(" - ")}
            </h1>
          </div>
          {children}
        </Content>
        <Footer className="text-center">@copyright 2023 Nguyen Anh Nhat</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
