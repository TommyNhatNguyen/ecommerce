import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { cn } from "@/lib/utils";
import { Modal, ModalProps, Spin } from "antd";
import { LoaderPinwheel } from "lucide-react";
import React from "react";
import { ClassNameValue } from "tailwind-merge";

type GeneralModalProps = {
  loading?: boolean;
  renderTitle?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  renderContent: () => React.ReactNode;
  className?: ClassNameValue;
  formContentClassName?: ClassNameValue;
} & ModalProps;

const GeneralModal = ({
  loading = false,
  renderTitle,
  renderFooter,
  renderContent,
  formContentClassName,
  className,
  ...props
}: GeneralModalProps) => {
  const _renderTitle = () => {
    return (
      <div className="form-title relative pb-2">
        {renderTitle && renderTitle()}
        <div className="absolute -left-[10%] bottom-0 h-[1px] w-lvw bg-zinc-500/30"></div>
      </div>
    );
  };
  const _renderContent = () => {
    return (
      <div className={cn("form-content my-4", formContentClassName)}>
        {renderContent()}
        <LoadingComponent isLoading={loading} />
      </div>
    );
  };
  const _renderFooter = () => {
    return <div className="form-footer">{renderFooter && renderFooter()}</div>;
  };
  return (
    <Modal
      {...props}
      centered={true}
      closable={true}
      mask={true}
      maskClosable={true}
      footer={renderFooter && _renderFooter()}
      title={renderTitle && _renderTitle()}
      className={cn("relative min-w-[60%]", className)}
    >
      {_renderContent()}
    </Modal>
  );
};

export default GeneralModal;
