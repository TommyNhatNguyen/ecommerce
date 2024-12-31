import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { Modal, ModalProps, Spin } from "antd";
import { LoaderPinwheel } from "lucide-react";
import React from "react";

type GeneralModalProps = {
  loading?: boolean;
  renderTitle: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  renderContent: () => React.ReactNode;
} & ModalProps;

const GeneralModal = ({
  loading = false,
  renderTitle,
  renderFooter,
  renderContent,
  ...props
}: GeneralModalProps) => {
  const _renderTitle = () => {
    return (
      <div className="form-title relative pb-2">
        {renderTitle()}
        <div className="absolute -left-[10%] bottom-0 h-[1px] w-lvw bg-zinc-500/30"></div>
      </div>
    );
  };
  const _renderContent = () => {
    return (
      <div className="form-content my-4">
        {renderContent()}
        <LoadingComponent isLoading={loading} />
      </div>
    );
  };
  const _renderFooter = () => {
    return <div className="form-footer">{renderFooter()}</div>;
  };
  return (
    <Modal
      {...props}
      centered={true}
      closable={true}
      mask={true}
      maskClosable={true}
      footer={_renderFooter()}
      title={_renderTitle()}
      className="relative min-w-[60%]"
    >
      {_renderContent()}
    </Modal>
  );
};

export default GeneralModal;
