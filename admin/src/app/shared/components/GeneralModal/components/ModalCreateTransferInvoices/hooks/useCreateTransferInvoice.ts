import { useNotification } from "@/app/contexts/NotificationContext";
import { TransferInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { invoicesService } from "@/app/shared/services/invoices/invoicesService";
import { useState } from "react";
import { useIntl } from "react-intl";

export const useCreateTransferInvoice = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const intl = useIntl();
  const {notificationApi} = useNotification()
  const handleCreateTransferInvoice = async (data: TransferInvoicesCreateDTO) => {
    try {
      setIsCreateLoading(true);
      const response = await invoicesService.createTransfer(data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "announcement" }),
          description: intl.formatMessage({ id: "create_invoices_success" }),
        });
      }
    } catch (error) {
      console.log(error);
      notificationApi.error({
        message: intl.formatMessage({ id: "announcement" }),
        description: intl.formatMessage({ id: "create_invoices_error" }),
      });
    } finally {
      setIsCreateLoading(false);
    }
  };
  return {
    isCreateLoading,
    handleCreateTransferInvoice,
  };
};
