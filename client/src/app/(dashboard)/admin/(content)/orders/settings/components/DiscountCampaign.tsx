import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { DISCOUNT_SCOPE, DISCOUNT_TYPE } from "@/app/constants/enum";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { Pencil, Trash2Icon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const DiscountCampaign = (props: Props) => {
  const {
    data: discountCampaigns,
    isLoading: isLoadingDiscountCampaigns,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["discountCampaigns"],
    queryFn: (p) =>
      discountsService.getDiscounts({
        scope: DISCOUNT_SCOPE.ORDER,
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
  const [
    isOpenModalCreateDiscountCampaign,
    setIsOpenModalCreateDiscountCampaign,
  ] = useState(false);
  const [
    isOpenModalUpdateDiscountCampaign,
    setIsOpenModalUpdateDiscountCampaign,
  ] = useState(false);
  const [updateDiscountCampaignId, setUpdateDiscountCampaignId] = useState("");
  const _onOpenModalCreateDiscountCampaign = () => {
    setIsOpenModalCreateDiscountCampaign(true);
  };
  const handleCloseModalCreateDiscountCampaign = () => {
    setIsOpenModalCreateDiscountCampaign(false);
  };
  const handleCloseModalUpdateDiscountCampaign = () => {
    setIsOpenModalUpdateDiscountCampaign(false);
  };
  const _onOpenModalUpdateDiscountCampaign = (id: string) => {
    setUpdateDiscountCampaignId(id);
    setIsOpenModalUpdateDiscountCampaign(true);
  };
  const handleSubmitCreateDiscountCampaign = async (data: any) => {
    await discountsService.createDiscount(data);
    refetch();
  };
  const _onDeleteDiscountCampaign = async (id: string) => {
    await discountsService.deleteDiscount(id);
    refetch();
  };
  return (
    <DataCard
      title="Discount Campaign"
      data={discountCampaigns?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isOpenModalCreateDiscountCampaign}
      isModalUpdateOpen={isOpenModalUpdateDiscountCampaign}
      updateId={updateDiscountCampaignId}
      handleOpenCreateModal={_onOpenModalCreateDiscountCampaign}
      handleCloseModalCreate={handleCloseModalCreateDiscountCampaign}
      handleCloseModalUpdate={handleCloseModalUpdateDiscountCampaign}
      refetch={refetch}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <div className="flex min-h-[100px] flex-col gap-2">
          {data &&
            data.map((item) => (
              <Tooltip
                title={`${
                  item.type === DISCOUNT_TYPE.PERCENTAGE
                    ? `${formatDiscountPercentage(item.amount || 0)}`
                    : `${formatCurrency(item.amount || 0)}`
                }`}
                key={item.id}
              >
                <div
                  className="flex w-full items-center justify-between"
                  key={item.id}
                >
                  {item.name}
                  <div className="flex items-center gap-1">
                    <Button
                      type="text"
                      className="aspect-square rounded-full p-0"
                      onClick={() => {
                        _onOpenModalUpdateDiscountCampaign(item.id);
                      }}
                    >
                      <Pencil className="h-4 w-4 stroke-yellow-500" />
                    </Button>
                    <ButtonDeleteWithPopover
                      title={`Delete ${item.name}?`}
                      trigger={"click"}
                      handleDelete={() => {
                        _onDeleteDiscountCampaign(item.id);
                      }}
                    />
                  </div>
                </div>
              </Tooltip>
            ))}
        </div>
      )}
      renderCreateModal={(
        isModalCreateOpen,
        handleCloseModalCreate,
        refetch,
      ) => (
        <CreateDiscountModal
          isModalCreateDiscountCampaignOpen={isModalCreateOpen}
          handleCloseModalCreateDiscountCampaign={handleCloseModalCreate}
          handleSubmitCreateDiscountCampaignForm={
            handleSubmitCreateDiscountCampaign
          }
          defaultScope={DISCOUNT_SCOPE.ORDER}
          refetch={refetch}
        />
      )}
      renderUpdateModal={(
        isModalUpdateOpen,
        handleCloseModalUpdate,
        updateId,
        refetch,
      ) => null}
    />
  );
};

export default DiscountCampaign;
