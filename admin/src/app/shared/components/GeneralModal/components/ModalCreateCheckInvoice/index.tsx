import GeneralModal from "@/app/shared/components/GeneralModal";
import InventoryCheckSummary from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckSummary";
import InventoryCheckTable from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckTable";
import InventoryCheckTabs from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckTabs";
import { useCreateCheck } from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/hooks/useCreateCheck";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { CheckInventoryInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { inventoryService } from "@/app/shared/services/inventory/inventoryService";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, Input, Select } from "antd";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

type Props = {
  refetch: () => void;
};

const ModalCreateCheckInvoice = ({ refetch }: Props, ref: any) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<CheckInventoryInvoicesCreateDTO>();
  const {
    inventoryTabsProps,
    selectedInventoryIds,
    handleChangeInventory,
    inventoryTableProps,
    handleSearch,
    search,
    debouncedSearch,
    inventoryCheckSummaryProps,
    handleCreateCheckInventoryInvoice,
    handleResetFields,
    isCreateLoading,
  } = useCreateCheck();
  const { data: warehouses } = useInfiniteQuery({
    queryKey: ["variant-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      warehouseService.getList({
        page: pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  const { data: inventory } = useInfiniteQuery({
    queryKey: ["inventory-infinite", watch("warehouse_id")],
    queryFn: ({ pageParam = 1 }) =>
      inventoryService.list({
        page: pageParam,
        limit: 10,
        include_product_sellable: true,
        include_inventory_warehouse: true,
        warehouse_id: watch("warehouse_id") || undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    enabled: !!watch("warehouse_id"),
  });
  const warehousesData = useMemo(
    () => warehouses?.pages.flatMap((page) => page.data),
    [warehouses],
  );
  const inventoryData = useMemo(
    () => inventory?.pages.flatMap((page) => page.data),
    [inventory],
  );
  const checkInventoryData = useMemo(
    () =>
      selectedInventoryIds?.map((id) =>
        inventoryData?.find((inventory) => inventory.id === id),
      ) || [],
    [inventoryData, selectedInventoryIds],
  );
  const _onChangeInventory = (value: string[]) => {
    setValue(
      "inventory_data",
      value.map((item) => ({
        inventory_id: item,
        actual_quantity:
          inventoryData?.find((inventory) => inventory.id === item)
            ?.warehouse?.[0]?.inventory_warehouse?.quantity || 0,
      })),
    );
    handleChangeInventory(value);
  };
  const _onChangeWarehouse = (value: string) => {
    setValue("warehouse_id", value);
    setValue("inventory_data", []);
    _onChangeInventory([]);
  };
  const handleOpenModal = () => {
    setOpen(true);
  };
  const _onCloseModal = () => {
    setOpen(false);
    handleResetFields();
    reset();
  };
  useImperativeHandle(ref, () => ({
    handleOpenModal,
    handleCloseModal: _onCloseModal,
  }));
  const _onConfirmCreateInvoices = async (
    data: CheckInventoryInvoicesCreateDTO,
  ) => {
    await handleCreateCheckInventoryInvoice(data);
    _onCloseModal();
    refetch();
  };
  const _renderTitle = () => {
    return (
      <h1 className="text-2xl font-bold">
        {intl.formatMessage({ id: `create_check_inventory_invoice` })}
      </h1>
    );
  };
  const _renderContent = () => {
    return (
      <div className="flex min-h-[792px] w-full flex-col gap-2">
        {/* Selection */}
        <div className="flex flex-col gap-2">
          {/* Select warehouse */}
          <InputAdmin
            required={true}
            label={intl.formatMessage({ id: "select_warehouse" })}
            placeholder={intl.formatMessage({ id: "select_warehouse" })}
            customComponent={(props, ref) => (
              <Controller
                control={control}
                name="warehouse_id"
                render={({ field: { onChange, ...field } }) => (
                  <Select
                    placeholder={intl.formatMessage({ id: "select_warehouse" })}
                    className="w-full"
                    options={warehousesData?.map((warehouse) => ({
                      label: warehouse.name,
                      value: warehouse.id,
                    }))}
                    {...field}
                    {...props}
                    onChange={_onChangeWarehouse}
                  />
                )}
              />
            )}
          />
          {/* Select product based on warehouse */}
          <InputAdmin
            required={true}
            label={intl.formatMessage({ id: "select_product" })}
            placeholder={intl.formatMessage({ id: "select_product" })}
            customComponent={(props, ref) => (
              <Select
                className="w-full"
                mode="multiple"
                options={inventoryData?.map((inventory) => ({
                  label: inventory.product_sellable?.variant?.name,
                  value: inventory.id,
                }))}
                allowClear={true}
                showSearch={true}
                disabled={!watch("warehouse_id")}
                {...props}
                value={selectedInventoryIds}
                onChange={_onChangeInventory}
              />
            )}
          />
          {/* Search bar */}
          <Input.Search
            placeholder={intl.formatMessage({ id: "search" })}
            className="mb-2 w-full"
            onChange={(e) => handleSearch(e.target.value)}
            value={search}
          />
        </div>
        {/* Content */}
        <div>
          <div>
            {/* Tabs */}
            <InventoryCheckTabs {...inventoryTabsProps} />
            {/* Inventory check table */}
            <InventoryCheckTable
              register={register}
              errors={errors}
              control={control}
              setValue={setValue}
              watch={watch}
              data={checkInventoryData || []}
              loading={false}
              {...inventoryTableProps}
            />
          </div>
          {/* Summary table */}
          <InventoryCheckSummary
            control={control}
            errors={errors}
            {...inventoryCheckSummaryProps}
          />
        </div>
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
      className="min-w-[90%]"
      maskClosable={false}
    />
  );
};

export default React.memo(forwardRef(ModalCreateCheckInvoice));
