import { ERROR_MESSAGE } from "@/app/constants/errors";
import CustomEditor from "@/app/shared/components/CustomEditor";
import GeneralModal from "@/app/shared/components/GeneralModal";
import ProductInventoryTable from "@/app/shared/components/GeneralModal/components/ModalCreateInvoices/components/ProductInventoryTable";
import { useCreateTransferInvoice } from "@/app/shared/components/GeneralModal/components/ModalCreateTransferInvoices/hooks/useCreateTransferInvoice";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { TransferInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { inventoryService } from "@/app/shared/services/inventory/inventoryService";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { formatNumber } from "@/app/shared/utils/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button, InputNumber, Select } from "antd";
import { Editor } from "ckeditor5";
import { ArrowRight } from "lucide-react";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

type Props = {
  refetch: () => void;
};

const ModalCreateTransferInvoices = ({ refetch }: Props, ref: any) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, watch, reset, setValue } =
    useForm<TransferInvoicesCreateDTO>();
  const { isCreateLoading, handleCreateTransferInvoice } =
    useCreateTransferInvoice();
  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => warehouseService.getAll(),
  });
  const {
    data: inventoriesData,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["inventories-infinite", watch("warehouse_id_from")],
    queryFn: ({ pageParam = 1 }) =>
      inventoryService.list({
        include_product_sellable: true,
        include_inventory_warehouse: true,
        page: pageParam,
        limit: 100,
        warehouse_id: watch("warehouse_id_from"),
      }),
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.total_page > lastPage?.meta?.current_page
        ? lastPage?.meta?.current_page + 1
        : undefined,
    initialPageParam: 1,
    enabled: !!watch("warehouse_id_from"),
  });
  const { data: inventoryDataFrom } = useQuery({
    queryKey: [
      "inventory-data-from",
      watch("inventory_id"),
      watch("warehouse_id_from"),
    ],
    queryFn: () =>
      inventoryService.getInventoryById(watch("inventory_id"), {
        warehouse_id: watch("warehouse_id_from"),
        include_inventory_warehouse: true,
        include_product_sellable: true,
      }),
    enabled: !!watch("inventory_id") && !!watch("warehouse_id_from"),
    retry: false,
  });
  const { data: inventoryDataTo } = useQuery({
    queryKey: [
      "inventory-data-to",
      watch("inventory_id"),
      watch("warehouse_id_to"),
    ],
    queryFn: () =>
      inventoryService.getInventoryById(watch("inventory_id"), {
        warehouse_id: watch("warehouse_id_to"),
        include_inventory_warehouse: true,
        include_product_sellable: true,
      }),
    enabled: !!watch("inventory_id") && !!watch("warehouse_id_to"),
    retry: false,
  });
  console.log(
    "🚀 ~ ModalCreateTransferInvoices ~ inventoryDataTo:",
    inventoryDataTo,
  );
  const inventories = useMemo(() => {
    return inventoriesData?.pages?.flatMap((page) => page.data);
  }, [inventoriesData]);

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
  const _onConfirmCreateInvoices: SubmitHandler<TransferInvoicesCreateDTO> = (
    data,
  ) => {
    handleCreateTransferInvoice(data);
    reset();
    setValue("note", "");
    refetch();
    _onCloseModal();
  };
  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: `create_transfer_invoice` })}
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
        <div className="flex items-center gap-2">
          {/* Chọn kho xuất */}
          <Controller
            control={control}
            name="warehouse_id_from"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field, formState: { errors } }) => (
              <InputAdmin
                label={intl.formatMessage({ id: "warehouse_from" })}
                placeholder={intl.formatMessage({ id: "warehouse_from" })}
                error={errors.warehouse_id_from?.message as string}
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
          {/* Chọn kho nhận */}
          <Controller
            control={control}
            name="warehouse_id_to"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field, formState: { errors } }) => (
              <InputAdmin
                label={intl.formatMessage({ id: "warehouse_to" })}
                placeholder={intl.formatMessage({ id: "warehouse_to" })}
                error={errors.warehouse_id_to?.message as string}
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
        </div>
        {/* Chọn sản phẩm */}
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
              label={intl.formatMessage({ id: "inventory_at_warehouse_from" })}
              placeholder={intl.formatMessage({
                id: "inventory_at_warehouse_from",
              })}
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
        {/* Thông tin sản phẩm ở kho xuất và kho nhập */}
        <div className="my-2 mt-2 flex w-full items-start justify-between gap-2">
          {/* Thông tin sản phẩm ở kho xuất */}
          <div className="flex w-full flex-col gap-2">
            <p className="text-sm font-bold">
              {intl.formatMessage({ id: "inventory_at_warehouse_from" })}
            </p>
            <ProductInventoryTable
              data={inventoryDataFrom?.warehouse || []}
              loading={isLoading}
            />
          </div>
          <ArrowRight width={32} height={32} className="flex-shrink-0" />
          {/* Thông tin sản phẩm ở kho nhập */}
          <div className="flex w-full flex-col gap-2">
            <p className="text-sm font-bold">
              {intl.formatMessage({ id: "inventory_at_warehouse_to" })}
            </p>
            <ProductInventoryTable
              data={inventoryDataTo?.warehouse || []}
              loading={isLoading}
            />
          </div>
        </div>
        {/* Số lượng */}
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
                  formatter={(value) => formatNumber(Number(value))}
                />
              )}
            />
          )}
        />
        {/* Ghi chú */}
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
      open={open}
      onCancel={_onCloseModal}
      renderTitle={_renderTitle}
      renderContent={_renderContent}
      renderFooter={_renderFooter}
      loading={isCreateLoading}
      className="min-w-[80%]"
    />
  );
};

export default React.memo(forwardRef(ModalCreateTransferInvoices));
