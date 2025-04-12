import { ERROR_MESSAGE } from "@/app/constants/errors";
import { useNotification } from "@/app/contexts/NotificationContext";
import CustomEditor from "@/app/shared/components/CustomEditor";
import GeneralModal, {
  ModalRefType,
} from "@/app/shared/components/GeneralModal";
import ProductInventoryTable from "@/app/shared/components/GeneralModal/components/ModalCreateInvoices/components/ProductInventoryTable";
import { useCreateInvoices } from "@/app/shared/components/GeneralModal/components/ModalCreateInvoices/hooks/useCreateInvoices";
import InputAdmin from "@/app/shared/components/InputAdmin";
import {
  InventoryInvoiceType,
  InvoicesCreateDTO,
} from "@/app/shared/interfaces/invoices/invoices.dto";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { inventoryService } from "@/app/shared/services/inventory/inventoryService";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, InputNumber, Select, Table } from "antd";
import { Editor } from "ckeditor5";
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

export type ModalCreateInvoicesRefType = {
  handleOpenModal: (type: InventoryInvoiceType) => void;
  handleCloseModal: () => void;
} & ModalRefType;

const ModalCreateInvoices = ({ refetch }: Props, ref: any) => {
  const [open, setOpen] = useState<InventoryInvoiceType | null>(null);
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryModel | null>(null);
  console.log(
    "🚀 ~ ModalCreateInvoices ~ selectedInventory:",
    selectedInventory,
  );
  const intl = useIntl();
  const { control, handleSubmit, reset, setValue, watch } =
    useForm<InvoicesCreateDTO>();
  const { isCreateLoading, handleCreateInvoices } = useCreateInvoices();
  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => warehouseService.getAll(),
  });
  const {
    data: inventoriesData,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["inventories-infinite", watch("warehouse_id")],
    queryFn: ({ pageParam = 1 }) =>
      inventoryService.list({
        include_product_sellable: true,
        include_inventory_warehouse: true,
        page: pageParam,
        limit: 100,
        warehouse_id: watch("warehouse_id"),
      }),
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.total_page > lastPage?.meta?.current_page
        ? lastPage?.meta?.current_page + 1
        : undefined,
    initialPageParam: 1,
    enabled: !!watch("warehouse_id"),
  });
  const inventories = useMemo(() => {
    return inventoriesData?.pages?.flatMap((page) => page.data);
  }, [inventoriesData]);
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
    refetch();
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
                  onChange={(value) => {
                    setSelectedInventory(
                      inventories?.find(
                        (inventory) => inventory.id === value,
                      ) || null,
                    );
                    field.onChange(value);
                  }}
                  ref={ref}
                />
              )}
            />
          )}
        />
        <div className="my-2">
          <p className="mb-1 text-sm font-bold">
            {intl.formatMessage(
              {
                id: "inventory_info_by_warehouse",
              },
              {
                product_name:
                  selectedInventory?.product_sellable?.variant?.name,
                warehouse_name: selectedInventory?.warehouse[0].name,
              },
            )}
          </p>
          <ProductInventoryTable
            data={selectedInventory?.warehouse || []}
            loading={isLoading}
          />
        </div>
        {/* Nhập quantity */}
        {open != "UPDATE_COST_INVOICE" && (
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
        )}
        {/* Nhập cost  */}
        {open != "DISCARD_INVOICE" && (
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
        )}
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
