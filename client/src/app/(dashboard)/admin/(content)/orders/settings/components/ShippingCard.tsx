import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import CreateDiscountModal from "@/app/shared/components/GeneralModal/components/CreateDiscountModal";
import CreateShippingModal from "@/app/shared/components/GeneralModal/components/CreateShippingModal";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { CreateShippingDTO } from "@/app/shared/interfaces/shipping/shipping.dto";
import { shippingService } from "@/app/shared/services/shipping/shippingService";
import { formatCurrency } from "@/app/shared/utils/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "antd";
import { Pencil, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const ShippingCard = (props: Props) => {
  const {
    data: shippingData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["shipping"],
    queryFn: (p) =>
      shippingService.getList({
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
  const [isOpenModalCreateShipping, setIsOpenModalCreateShipping] =
    useState(false);
  const [isOpenModalUpdateShipping, setIsOpenModalUpdateShipping] =
    useState(false);
  const [updateShippingId, setUpdateShippingId] = useState<string>("");
  const _onOpenModalCreateShipping = () => {
    setIsOpenModalCreateShipping(true);
  };
  const handleCloseModalCreateShipping = () => {
    setIsOpenModalCreateShipping(false);
  };
  const handleCloseModalUpdateShipping = () => {
    setIsOpenModalUpdateShipping(false);
  };
  const _onDeleteShipping = async (id: string) => {
    await shippingService.deleteShipping(id);
    refetch();
  };
  const _onOpenModalUpdateShipping = (id: string) => {
    setUpdateShippingId(id);
    setIsOpenModalUpdateShipping(true);
  };
  const handleSubmitCreateShipping = async (data: CreateShippingDTO) => {
    await shippingService.createShipping(data);
    refetch();
  };
  return (
    <DataCard
      title="Shipping"
      data={shippingData?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isOpenModalCreateShipping}
      isModalUpdateOpen={isOpenModalUpdateShipping}
      updateId={updateShippingId}
      handleOpenCreateModal={_onOpenModalCreateShipping}
      handleCloseModalCreate={handleCloseModalCreateShipping}
      handleCloseModalUpdate={handleCloseModalUpdateShipping}
      refetch={refetch}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <div className="flex min-h-[100px] flex-col gap-2">
          {data.map((item) => (
            <Tooltip title={item.type} key={item.id}>
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
        </div>
      )}
      renderCreateModal={(
        isModalCreateOpen,
        handleCloseModalCreate,
        refetch,
      ) => (
        <CreateShippingModal
          isModalCreateShippingOpen={isModalCreateOpen}
          handleCloseModalCreateShipping={handleCloseModalCreate}
          handleSubmitCreateShippingForm={handleSubmitCreateShipping}
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

export default ShippingCard;
