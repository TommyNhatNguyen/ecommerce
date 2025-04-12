import { useNotification } from "@/app/contexts/NotificationContext";
import { InvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { invoicesService } from "@/app/shared/services/invoices/invoicesService";
import { useState } from "react";
import { useIntl } from "react-intl";

export const useCreateInvoices = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const { notificationApi } = useNotification();
  const intl = useIntl();
  const handleCreateInvoices = async (data: InvoicesCreateDTO) => {
    setIsCreateLoading(true);
    try {
      const response = await invoicesService.create(data);
      if (response) {
        setIsCreateLoading(false);
        notificationApi.success({
          message: intl.formatMessage({ id: "create_invoices_success" }),
          description: intl.formatMessage({ id: "create_invoices_success" }),
        });
        return response;
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "create_invoices_error" }),
          description: intl.formatMessage({ id: "create_invoices_error" }),
        });
      }
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: intl.formatMessage({ id: "create_invoices_error" }),
        description: intl.formatMessage({ id: "create_invoices_error" }),
      });
    } finally {
      setIsCreateLoading(false);
    }
  };
  return {
    isCreateLoading,
    handleCreateInvoices,
  };
};
