import GeneralModal from "@/app/shared/components/GeneralModal";
import SettingContent from "@/app/shared/components/GeneralModal/components/SettingModal/components/SettingContent";
import SettingSidebar from "@/app/shared/components/GeneralModal/components/SettingModal/components/SettingSidebar";
import { Layout } from "antd";
import React from "react";

type Props = { open: boolean; handleCancel: () => void; loading?: boolean };

const SettingModal = ({
  open,
  handleCancel,
  loading = false,
  ...props
}: Props) => {
  const _onCancel = () => {
    handleCancel();
  };
  const _renderTitle = () => {
    return <h1 className="text-2xl font-bold">Settings</h1>;
  };
  const _renderContent = () => {
    return (
      <Layout className="mx-[-24px] mt-[-8px] h-full">
        {/* Sidebar with tabs */}
        <SettingSidebar />
        {/* Content */}
        <SettingContent />
      </Layout>
    );
  };
  const _renderFooter = () => {
    return <div></div>;
  };
  return (
    <GeneralModal
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      formContentClassName="my-0"
      open={open}
      onCancel={_onCancel}
      loading={loading}
      className={"min-w-[80vw] max-h-fit"}
      {...props}
    />
  );
};

export default SettingModal;
