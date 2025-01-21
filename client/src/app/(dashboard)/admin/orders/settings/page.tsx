"use client";
import { useShipping } from "@/app/(dashboard)/admin/orders/settings/hooks/useShipping";
import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import CreateShippingModal from "@/app/shared/components/GeneralModal/components/CreateShippingModal";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { formatCurrency } from "@/app/shared/utils/utils";
import { Button, Card, Empty, Tooltip } from "antd";
import { Pencil, PlusIcon, Trash2Icon } from "lucide-react";
import React from "react";

type Props = {};
// Button with delete confirmation popover
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const SettingsPage = (props: Props) => {
  const {
    shippingData,
    isLoadingShipping,
    handleOpenModalCreateShipping,
    handleCloseModalCreateShipping,
    handleSubmitCreateShipping,
    isOpenModalCreateShipping,
    handleOpenModalUpdateShipping,
    handleCloseModalUpdateShipping,
    isOpenModalUpdateShipping,
    createShippingLoading,
    createShippingError,
    handleDeleteShipping,
  } = useShipping();
  const _onOpenModalUpdateShipping = (id: string) => {
    handleOpenModalUpdateShipping(id);
  };
  const _onDeleteShipping = (id: string) => {
    handleDeleteShipping(id);
  };
  return (
    <main className="setting-page">
      SettingsPage
      <div className="grid min-h-[300px] grid-flow-row grid-cols-3 gap-4">
        {/* Shipping Card */}
        <Card
          title="Shipping"
          className="relative h-full max-h-[300px] overflow-y-auto"
          extra={
            <Button
              type="primary"
              className="flex items-center gap-2"
              onClick={handleOpenModalCreateShipping}
            >
              <PlusIcon className="h-4 w-4" />
              Add new
            </Button>
          }
        >
          {shippingData &&
            shippingData.data.map((item) => (
              <Tooltip title={`${item.type}`} key={item.id}>
                <div className="flex w-full items-center justify-between">
                  {item.type} - {formatCurrency(item.cost)}
                  <div className="flex items-center gap-1">
                    <Button
                      type="text"
                      className="aspect-square rounded-full p-0"
                      onClick={() => _onOpenModalUpdateShipping(item.id)}
                    >
                      <Pencil className="h-4 w-4 stroke-yellow-500" />
                    </Button>
                    <ButtonDeleteWithPopover
                      title={`Delete ${item.type}?`}
                      trigger={"click"}
                      handleDelete={() => {
                        _onDeleteShipping(item.id);
                      }}
                    />
                  </div>
                </div>
              </Tooltip>
            ))}
          {shippingData && shippingData.data.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <Empty description="No shipping found" />
            </div>
          )}
        </Card>
      </div>
      <p>shipping</p>
      <p>payment</p>
      <p>discount</p>
      <p>cost</p>
      {/* Modals */}
      <CreateShippingModal
        isModalCreateShippingOpen={isOpenModalCreateShipping}
        handleCloseModalCreateShipping={handleCloseModalCreateShipping}
        handleSubmitCreateShippingForm={handleSubmitCreateShipping}
        loading={isLoadingShipping}
      />
    </main>
  );
};

export default SettingsPage;
