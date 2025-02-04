import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useDiscounts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useDiscounts";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import { ButtonDeleteWithPopover } from "@/app/shared/components/Button";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import UpdateDiscountModal from "@/app/shared/components/GeneralModal/components/UpdateDiscountModal";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { getDateFormat } from "@/app/shared/utils/datetime";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Empty, Tooltip } from "antd";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const DiscountCard = (props: Props) => {
  const [
    isModalCreateDiscountCampaignOpen,
    setIsModalCreateDiscountCampaignOpen,
  ] = useState(false);
  const [
    isModalUpdateDiscountCampaignOpen,
    setIsModalUpdateDiscountCampaignOpen,
  ] = useState(false);
  const [updateDiscountCampaignId, setUpdateDiscountCampaignId] =
    useState<string>("");
  const {
    loading: createDiscountLoading,
    hanldeCreateDiscount,
    hanldeDeleteDiscount,
    loadingDelete: deleteDiscountLoading,
  } = useDiscounts();
  const {
    data: discounts,
    isLoading: isLoadingDiscounts,
    refetch: refetchDiscounts,
  } = useQuery({
    queryKey: ["discounts", deleteDiscountLoading],
    queryFn: () =>
      discountsService.getDiscounts({
        scope: DISCOUNT_SCOPE.PRODUCT,
      }),
    placeholderData: keepPreviousData,
  });

  const _onDeleteDiscount = async (id: string) => {
    await hanldeDeleteDiscount(id);
  };
  const _onOpenModalUpdateDiscountCampaign = (id: string) => {
    setUpdateDiscountCampaignId(id);
    setIsModalUpdateDiscountCampaignOpen(true);
  };

  const handleCloseModalUpdateDiscountCampaign = () => {
    setIsModalUpdateDiscountCampaignOpen(false);
  };

  const _onOpenModalCreateDiscountCampaign = () => {
    setIsModalCreateDiscountCampaignOpen(true);
  };

  const handleCloseModalCreateDiscountCampaign = () => {
    setIsModalCreateDiscountCampaignOpen(false);
  };
  const handleSubmitCreateDiscountCampaignForm = async (data: any) => {
    const payload: CreateDiscountDTO = {
      name: data.name,
      description: data.description,
      amount: Number(data.amount),
      type: data.type,
      scope: data.scope,
      start_date: data.startDate.format(getDateFormat()),
      end_date: data.endDate.format(getDateFormat()),
    };
    await hanldeCreateDiscount(payload);
    handleCloseModalCreateDiscountCampaign();
  };
  return (
    <DataCard
      title="Discount Campaign"
      data={discounts?.data || []}
      isModalCreateOpen={isModalCreateDiscountCampaignOpen}
      isModalUpdateOpen={isModalUpdateDiscountCampaignOpen}
      updateId={updateDiscountCampaignId}
      handleOpenCreateModal={_onOpenModalCreateDiscountCampaign}
      handleCloseModalCreate={handleCloseModalCreateDiscountCampaign}
      handleCloseModalUpdate={handleCloseModalUpdateDiscountCampaign}
      refetch={refetchDiscounts}
      renderComponent={(data) => (
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <Tooltip
              title={
                item.type === DISCOUNT_TYPE.PERCENTAGE
                  ? formatDiscountPercentage(item.amount || 0)
                  : formatCurrency(item.amount || 0)
              }
              key={item.id}
            >
              <div className="flex w-full items-center justify-between">
                {item.name}
                <div className="flex items-center gap-1">
                  <Button
                    type="text"
                    className="aspect-square rounded-full p-0"
                    onClick={() => _onOpenModalUpdateDiscountCampaign(item.id)}
                  >
                    <Pencil className="h-4 w-4 stroke-yellow-500" />
                  </Button>
                  <ButtonDeleteWithPopover
                    title={`Delete ${item.name}?`}
                    trigger={"click"}
                    handleDelete={() => {
                      _onDeleteDiscount(item.id);
                    }}
                  />
                </div>
              </div>
            </Tooltip>
          ))}
          {data.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <Empty description="No discounts found" />
            </div>
          )}
        </div>
      )}
      renderCreateModal={(isModalOpen, handleClose, refetch) => (
        <CreateDiscountModal
          isModalCreateDiscountCampaignOpen={isModalOpen}
          handleCloseModalCreateDiscountCampaign={handleClose}
          handleSubmitCreateDiscountCampaignForm={
            handleSubmitCreateDiscountCampaignForm
          }
          loading={createDiscountLoading}
          refetch={refetch}
        />
      )}
      renderUpdateModal={(isModalOpen, handleClose, updateId, refetch) => (
        <UpdateDiscountModal
          isModalUpdateDiscountCampaignOpen={isModalOpen}
          handleCloseModalUpdateDiscountCampaign={handleClose}
          updateDiscountCampaignId={updateId}
          refetch={refetch}
        />
      )}
    />
  );
};

export default DiscountCard;
