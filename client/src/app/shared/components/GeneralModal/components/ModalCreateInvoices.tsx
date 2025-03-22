import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import { InventoryInvoiceType } from "@/app/shared/interfaces/invoices/invoices.dto";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useIntl } from "react-intl";

type Props = {};

export type ModalCreateInvoicesRefType = {
  handleOpenModal: (type: InventoryInvoiceType) => void;
  handleCloseModal: () => void;
} & ModalRefType;

const ModalCreateInvoices = (
  {},
  ref: any,
) => {
  const intl = useIntl();
  const [open, setOpen] = useState<InventoryInvoiceType | null>(
    "IMPORT_INVOICE",
  );
  const handleOpenModal = (type: InventoryInvoiceType) => {
    setOpen(type);
  };
  const _onCloseModal = () => {
    setOpen(null);
  };
  useImperativeHandle(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));
  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: `create_${open?.toLowerCase()}` })}
      </h1>
    );
  };
  const _renderContent = () => {
    return <div>ModalCreateInvoices</div>;
  };
  const _renderFooter = () => {
    return <div>ModalCreateInvoices</div>;
  };

  return (
    <GeneralModal
      open={!!open}
      onCancel={_onCloseModal}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
    />
  );
};

export default React.memo(forwardRef(ModalCreateInvoices));
