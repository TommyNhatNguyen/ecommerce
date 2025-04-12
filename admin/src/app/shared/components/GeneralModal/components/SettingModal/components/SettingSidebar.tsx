import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React from "react";

type Props = {};

const SettingSidebar = (props: Props) => {
  return (
    <Sider className="h-full max-h-[70vh] overflow-y-auto bg-custom-white">
      <Menu
        mode="vertical"
        items={[
          {
            key: "1",
            label: "General Settings",
            children: [
              { key: "1-1", label: "Profile" },
              { key: "1-2", label: "Account" },
              { key: "1-3", label: "Privacy" },
            ],
          },
          {
            key: "2",
            label: "Appearance",
            children: [
              { key: "2-1", label: "Theme" },
              { key: "2-2", label: "Colors" },
              { key: "2-3", label: "Font" },
            ],
          },
          {
            key: "3",
            label: "Notifications",
            children: [
              { key: "3-1", label: "Email" },
              { key: "3-2", label: "Push" },
              { key: "3-3", label: "In-App" },
            ],
          },
          {
            key: "4",
            label: "Security",
            children: [
              { key: "4-1", label: "Password" },
              { key: "4-2", label: "2FA" },
              { key: "4-3", label: "Sessions" },
            ],
          },
          {
            key: "5",
            label: "Integrations",
            children: [
              { key: "5-1", label: "Social Media" },
              { key: "5-2", label: "APIs" },
              { key: "5-3", label: "Webhooks" },
            ],
          },
          {
            key: "6",
            label: "Billing",
            children: [
              { key: "6-1", label: "Plans" },
              { key: "6-2", label: "Payment Methods" },
              { key: "6-3", label: "Invoices" },
            ],
          },
          {
            key: "7",
            label: "Support",
            children: [
              { key: "7-1", label: "Help Center" },
              { key: "7-2", label: "Contact Us" },
              { key: "7-3", label: "FAQs" },
            ],
          },
        ]}
        className="h-full w-full"
      />
    </Sider>
  );
};

export default SettingSidebar;
