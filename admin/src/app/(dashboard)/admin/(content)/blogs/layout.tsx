"use client";
import {
  Book,
  LucideCheckCircle,
  LucideFileCheck,
  LucideFileText,
  LucideSettings,
  LucideTruck,
  LucideX,
  Plus,
} from "lucide-react";
import { LucideTrash } from "lucide-react";
import { Package } from "lucide-react";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { cn } from "@/app/shared/utils/utils";
import { Tabs, TabsProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type BlogsLayoutPropsType = {
  children: React.ReactNode;
};

const BlogsLayout = ({ children }: BlogsLayoutPropsType) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(
    pathname || ADMIN_ROUTES.blogs.index,
  );
  const router = useRouter();
  const _onChangeTab = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };
  const tabs: TabsProps["items"] = [
    {
      label: "Blogs",
      key: ADMIN_ROUTES.blogs.index,
      icon: <Book className="h-4 w-4" />,
    },
    {
      label: "New Blogs",
      key: ADMIN_ROUTES.blogs.create,
      icon: <Plus className="h-4 w-4" />,
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

export default BlogsLayout;
