import { ERROR_MESSAGE } from "@/app/constants/errors";
import { useNotification } from "@/app/contexts/NotificationContext";
import CustomEditor from "@/app/shared/components/CustomEditor";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import { useCreateInvoices } from "@/app/shared/components/GeneralModal/hooks/useCreateInvoices";
import InputAdmin from "@/app/shared/components/InputAdmin";
import {
  InventoryInvoiceType,
  InvoicesCreateDTO,
} from "@/app/shared/interfaces/invoices/invoices.dto";
import { inventoryService } from "@/app/shared/services/inventory/inventoryService";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { formatCurrency } from "@/app/shared/utils/utils";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, InputNumber, Select } from "antd";
import { Editor } from "ckeditor5";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

type Props = {};

export type ModalCreateInvoicesRefType = {
  handleOpenModal: (type: InventoryInvoiceType) => void;
  handleCloseModal: () => void;
} & ModalRefType;

const ModalCreateInvoices = ({}, ref: any) => {
  const intl = useIntl();
  const { control, handleSubmit, reset, setValue } =
    useForm<InvoicesCreateDTO>();
  const { isCreateLoading, handleCreateInvoices } = useCreateInvoices();
  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => warehouseService.getAll(),
  });
  const { data: inventoriesData } = useInfiniteQuery({
    queryKey: ["inventories-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      inventoryService.list({
        include_product_sellable: true,
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.total_page > lastPage?.meta?.current_page
        ? lastPage?.meta?.current_page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  const inventories = useMemo(() => {
    return inventoriesData?.pages?.flatMap((page) => page.data);
  }, [inventoriesData]);
  const [open, setOpen] = useState<InventoryInvoiceType | null>(null);
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
  const _onConfirmCreateInvoices: SubmitHandler<InvoicesCreateDTO> = async (
    data,
  ) => {
    await handleCreateInvoices({
      ...data,
      type: open || ("IMPORT_INVOICE" as InventoryInvoiceType),
    });
    reset();
    setValue("note", "");
    _onCloseModal();
  };
  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: `create_${open?.toLowerCase()}` })}
      </h1>
    );
  };
  const _renderContent = () => {
    return (
      <div className="flex w-full flex-col gap-2">
        {/* Nhập code */}
        <Controller
          control={control}
          name="code"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "invoice_code" })}
              placeholder={intl.formatMessage({ id: "invoice_code" })}
              error={errors.code?.message as string}
              required={true}
              {...field}
            />
          )}
        />
        {/* Chọn single warehouse */}
        <Controller
          control={control}
          name="warehouse_id"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "warehouse" })}
              placeholder={intl.formatMessage({ id: "warehouse" })}
              error={errors.warehouse_id?.message as string}
              required={true}
              {...field}
              customComponent={(props: any, ref: any) => (
                <Select
                  options={warehouses?.data?.map((warehouse) => ({
                    label: warehouse.name,
                    value: warehouse.id,
                  }))}
                  {...props}
                  ref={ref}
                />
              )}
            />
          )}
        />
        {/* Chọn inventory_id dựa vào variant */}
        <Controller
          control={control}
          name="inventory_id"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "inventory" })}
              placeholder={intl.formatMessage({ id: "inventory" })}
              error={errors.inventory_id?.message as string}
              required={true}
              {...field}
              customComponent={(props: any, ref: any) => (
                <Select
                  options={inventories?.map((inventory) => ({
                    label: inventory?.product_sellable?.variant?.name,
                    value: inventory?.id,
                  }))}
                  {...props}
                  ref={ref}
                />
              )}
            />
          )}
        />
        {/* Nhập quantity */}
        <Controller
          control={control}
          name="quantity"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "quantity" })}
              placeholder={intl.formatMessage({ id: "quantity" })}
              error={errors.quantity?.message as string}
              required={true}
              {...field}
              customComponent={(props: any, ref: any) => (
                <InputNumber
                  {...props}
                  ref={ref}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              )}
            />
          )}
        />
        {/* Nhập cost  */}
        <Controller
          control={control}
          name="cost"
          rules={{
            required: {
              value: true,
              message: ERROR_MESSAGE.REQUIRED,
            },
          }}
          render={({ field, formState: { errors } }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "cost" })}
              placeholder={intl.formatMessage({ id: "cost" })}
              error={errors.cost?.message as string}
              required={true}
              {...field}
              customComponent={(props: any, ref: any) => (
                <InputNumber
                  {...props}
                  ref={ref}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              )}
            />
          )}
        />
        {/* Nhập note */}
        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <InputAdmin
              label={intl.formatMessage({ id: "note" })}
              placeholder={intl.formatMessage({ id: "note" })}
              {...field}
              customComponent={({ onChange, props }: any, ref: any) => (
                <CustomEditor
                  onChange={(_: any, editor: Editor) => {
                    field.onChange(editor.getData());
                  }}
                  {...props}
                  ref={ref}
                />
              )}
            />
          )}
        />
      </div>
    );
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
          onClick={handleSubmit(_onConfirmCreateInvoices)}
        >
          {intl.formatMessage({ id: "add_new" })}
        </Button>
      </div>
    );
  };

  return (
    <GeneralModal
      open={!!open}
      onCancel={_onCloseModal}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      loading={isCreateLoading}
    />
  );
};

export default React.memo(forwardRef(ModalCreateInvoices));
