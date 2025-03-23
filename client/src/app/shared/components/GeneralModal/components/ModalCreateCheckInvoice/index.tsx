import GeneralModal from '@/app/shared/components/GeneralModal';
import { Button } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useIntl } from 'react-intl';

type Props = {}

const ModalCreateCheckInvoice = (props: Props, ref: any) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
  };
  useImperativeHandle(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));
  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: `create_check_inventory_invoice` })}
      </h1>
    );
  };
  const _renderContent = () => {
    return <div>ModalCreateCheckInvoice</div>;
  };
  const _renderFooter = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCloseModal}>
          {intl.formatMessage({ id: "close" })}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          // onClick={handleSubmit(_onConfirmCreateInvoices)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  };
  
  return (
    <GeneralModal
      open={open}
      onCancel={_onCloseModal}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      // loading={isCreateLoading}
      className="min-w-[90%]"
    />
  )
}

export default React.memo(forwardRef(ModalCreateCheckInvoice));