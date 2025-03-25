import GeneralModal from "@/app/shared/components/GeneralModal";
import InventoryCheckSummary from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckSummary";
import InventoryCheckTable from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckTable";
import InventoryCheckTabs from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/components/InventoryCheckTabs";
import { useCreateCheck } from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice/hooks/useCreateCheck";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { inventoryService } from "@/app/shared/services/inventory/inventoryService";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, Input, Select } from "antd";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useIntl } from "react-intl";

type Props = {};

const ModalCreateCheckInvoice = (props: Props, ref: any) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const {
    inventoryTabsProps,
    selectedWarehouseId,
    handleChangeWarehouse,
    selectedInventoryIds,
    handleChangeInventory,
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
    queryKey: ["inventory-infinite", selectedWarehouseId],
    queryFn: ({ pageParam = 1 }) =>
      inventoryService.list({
        page: pageParam,
        limit: 10,
        include_product_sellable: true,
        include_inventory_warehouse: true,
        warehouse_id: selectedWarehouseId,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    enabled: !!selectedWarehouseId,
  });
  const warehousesData = warehouses?.pages.flatMap((page) => page.data);
  const inventoryData = inventory?.pages.flatMap((page) => page.data);
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
    return (
      <div className="flex min-h-[792px] w-full flex-col gap-2">
        {/* Selection */}
        <div>
          {/* Select warehouse */}
          <InputAdmin
            required={true}
            label={intl.formatMessage({ id: "select_warehouse" })}
            placeholder={intl.formatMessage({ id: "select_warehouse" })}
            customComponent={(props, ref) => (
              <Select
                className="w-full"
                options={warehousesData?.map((warehouse) => ({
                  label: warehouse.name,
                  value: warehouse.id,
                }))}
                {...props}
                onChange={handleChangeWarehouse}
              />
            )}
          />
          {/* Select product based on warehouse */}
          <InputAdmin
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
                disabled={!selectedWarehouseId}
                {...props}
                value={selectedInventoryIds}
                onChange={handleChangeInventory}
              />
            )}
          />
        </div>
        {/* Content */}
        <div>
          {/* Search bar */}
          <Input.Search
            placeholder={intl.formatMessage({ id: "search" })}
            className="w-full"
          />
          <div>
            {/* Tabs */}
            <InventoryCheckTabs {...inventoryTabsProps} />
            {/* Inventory check table */}
            <InventoryCheckTable data={[]} loading={false} />
          </div>
          {/* Summary table */}
          <InventoryCheckSummary />
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
      maskClosable={false}
    />
  );
};

export default React.memo(forwardRef(ModalCreateCheckInvoice));
