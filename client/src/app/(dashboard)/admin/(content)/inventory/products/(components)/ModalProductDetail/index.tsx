import GeneralModal from "@/app/shared/components/GeneralModal";
import { ProductSellableModel } from "@/app/shared/models/products/products-sellable.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import React from "react";

type Props = {
  data: VariantProductModel | null;
  open: boolean;
  onCancel: () => void;
};

const ModalProductDetail = ({ data, open, onCancel, ...props }: Props) => {
  console.log("data", data);
  const renderTitle = () => {
    return <div>ModalProductDetail</div>;
  }
  const renderContent = () => {
    return <div>ModalProductDetail</div>;
  }
  const renderFooter = () => {
    return <div>ModalProductDetail</div>;
  }
  return (
    <GeneralModal
      open={open}
      renderTitle={renderTitle}
      renderContent={renderContent}
      renderFooter={renderFooter}
      onCancel={onCancel}
      {...props}
    />
  );
};

export default React.memo(ModalProductDetail);
