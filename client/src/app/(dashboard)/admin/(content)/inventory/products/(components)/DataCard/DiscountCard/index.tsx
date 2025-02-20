import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useDiscounts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useDiscounts";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import UpdateDiscountModal from "@/app/shared/components/GeneralModal/components/UpdateDiscountModal";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { getDateFormat } from "@/app/shared/utils/datetime";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, Empty, Tooltip } from "antd";
import { Pencil, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
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
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["discounts", deleteDiscountLoading],
    queryFn: (p) =>
      discountsService.getDiscounts({
        scope: DISCOUNT_SCOPE.PRODUCT,
        page: p.pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
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
  const handleSubmitCreateDiscountCampaignForm = async (
    data: CreateDiscountDTO,
  ) => {
    const payload: CreateDiscountDTO = {
      name: data.name,
      description: data.description,
      amount: Number(data.amount),
      is_fixed: data.is_fixed,
      max_discount_count: data.max_discount_count,
      require_product_count: data.require_product_count,
      require_order_amount: data.require_order_amount,
      is_free: data.is_free,
      scope: data.scope,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    await hanldeCreateDiscount(payload);
    handleCloseModalCreateDiscountCampaign();
    refetchDiscounts();
  };
  return (
    <DataCard
      title="Discount Campaign"
      data={discounts?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isModalCreateDiscountCampaignOpen}
      isModalUpdateOpen={isModalUpdateDiscountCampaignOpen}
      updateId={updateDiscountCampaignId}
      handleOpenCreateModal={_onOpenModalCreateDiscountCampaign}
      handleCloseModalCreate={handleCloseModalCreateDiscountCampaign}
      handleCloseModalUpdate={handleCloseModalUpdateDiscountCampaign}
      refetch={refetchDiscounts}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <div className="flex min-h-[100px] flex-col gap-2">
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
