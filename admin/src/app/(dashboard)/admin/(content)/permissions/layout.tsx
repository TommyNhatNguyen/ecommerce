"use client";
import { Tabs } from "antd";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { TabsProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { cn } from "@/app/shared/utils/utils";
import { BookUserIcon, LucideFileText, User, UserCog } from "lucide-react";
import { useAppSelector } from "@/app/shared/hooks/useRedux";

type PermissionLayoutPropsType = {
  children: React.ReactNode;
};

const PermissionLayout = ({ children }: PermissionLayoutPropsType) => {
  const pathname = usePathname();
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<string>(
    pathname || ADMIN_ROUTES.permissions.index,
  );
  const _onChangeTab = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };
  const tabs: TabsProps["items"] = [
    {
      key: ADMIN_ROUTES.permissions.index,
      label: "Permission setting",
      icon: <LucideFileText size={16} />,
    },
    {
      key: ADMIN_ROUTES.permissions.role,
      label: "Permission ROle",
      icon: <UserCog size={16} />,
    },
    {
      key: ADMIN_ROUTES.permissions.user,
      label: "Permission setting",
      icon: <User size={16} />,
    },
  ];

  return (
    <>
      <div className="mb-4 rounded-lg bg-white px-4 py-2">
        <Tabs items={tabs} onChange={_onChangeTab} activeKey={activeTab} />
      </div>
      {children}
    </>
  );
};

export default PermissionLayout;
