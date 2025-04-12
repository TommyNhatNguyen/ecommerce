import { Input, Dropdown, Avatar, Select } from "antd";
import { Search, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { Header } from "antd/es/layout/layout";
import Notification from "@/app/layouts/components/Notification";
import { MenuItem } from "@/app/shared/types/antd.model";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { useAppDispatch, useAppSelector } from "@/app/shared/hooks/useRedux";
import { logout } from "@/app/shared/store/reducers/auth";
import { useRouter } from "next/navigation";
import SettingModal from "@/app/shared/components/GeneralModal/components/SettingModal";
import { useSettingModal } from "@/app/layouts/hooks/useSettingModal";
import { LOCALES } from "@/app/shared/translation/locales";
import { useLanguage } from "@/app/shared/hooks/useLanguage";

export const HeaderSection = () => {
  const { locale, switchLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);
  const { handleOpen, ...settings } = useSettingModal();
  const _onLogout = () => {
    dispatch(logout());
    router.push(ADMIN_ROUTES.login);
  };
  const _onOpenSettingModal = () => {
    handleOpen();
  };
  const dropdownItems: MenuItem[] = [
    {
      key: "user-role",
      label: userInfo?.role?.name?.split("_").join(" ") || "",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "user-profile",
      label: "Profile (Comming soon)",
      icon: <User size={16} />,
      disabled: true,
    },
    {
      key: "user-settings",
      label: "Settings",
      icon: <Settings size={16} />,
      onClick: _onOpenSettingModal,
    },
    {
      key: "user-logout",
      label: "Logout",
      icon: <LogOut size={16} />,
      onClick: _onLogout,
    },
  ];
  return (
    <>
      <Header className="flex items-center justify-between bg-white px-4">
        <Input.Search
          placeholder="Search..."
          style={{ width: 300 }}
          prefix={<Search />}
        />
        <div className="flex items-center gap-4">
          <Select
            value={locale}
            onChange={switchLanguage}
            options={[
              { value: LOCALES.ENGLISH, label: "English" },
              { value: LOCALES.VIETNAMESE, label: "Tiếng Việt" },
            ]}
          />
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
      <SettingModal {...settings} />
    </>
  );
};
