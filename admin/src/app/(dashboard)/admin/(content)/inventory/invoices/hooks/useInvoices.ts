import { brandService } from "@/app/shared/services/brands/brandService";

import {
  BrandCreateDTO,
  BrandUpdateDTO,
} from "@/app/shared/interfaces/brands/brands.dto";
import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { useIntl } from "react-intl";
import { InvoicesCreateDTO, InvoicesUpdateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { invoicesService } from "@/app/shared/services/invoices/invoicesService";

export const useInvoices = () => {
  const [loadingCreateInvoices, setLoadingCreateInvoices] = useState(false);
  const [loadingUpdateInvoices, setLoadingUpdateInvoices] = useState(false);
  const [loadingDeleteInvoices, setLoadingDeleteInvoices] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const { notificationApi } = useNotification();
  const intl = useIntl();

  // const handleUpdateInvoices = async (
  //   id: string,
  //   data: InvoicesUpdateDTO,
  //   callback?: () => void,
  // ) => {
  //   try {
  //     setLoadingUpdateInvoices(true);
  //     const response = await invoicesService.update(id, data);
  //     if (response) {
  //       notificationApi.success({
  //         message: intl.formatMessage({ id: "update_invoices_success" }),
  //       });
  //     } else {
  //       notificationApi.error({
  //         message: intl.formatMessage({ id: "update_invoices_error" }),
  //       });
  //     }
  //     return response;
  //   } catch (error) {
  //     notificationApi.error({
  //       message: intl.formatMessage({ id: "update_invoices_error" }),
  //     });
  //   } finally {
  //     setLoadingUpdateInvoices(false);
  //     callback?.();
  //   }
  // };

  const handleDeleteInvoices = async (id: string, callback?: () => void) => {
    try {
      setLoadingDeleteInvoices(true);
      const response = await invoicesService.delete(id);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_invoices_success" }),
        });
      } else {
        notificationApi.error({
          message: intl.formatMessage({ id: "delete_invoices_error" }),
        });
      }
      return response;
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "delete_invoices_error" }),
      });
    } finally {
      setLoadingDeleteInvoices(false);
      callback?.();
    }
  };
  const handleSelectInvoices = (
    selectedRowKeys: string[],
    selectedRows: any[],
  ) => {
    setSelectedInvoices(selectedRowKeys);
  };
  return {
    // handleCreateInvoices,
    loadingCreateInvoices,
    // handleUpdateInvoices,
    loadingUpdateInvoices,
    handleDeleteInvoices,
    loadingDeleteInvoices,
    handleSelectInvoices,
    selectedInvoices,
  };
};
