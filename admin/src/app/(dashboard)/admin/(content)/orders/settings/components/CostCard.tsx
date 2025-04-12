import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { costService } from "@/app/shared/services/cost/costService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import {
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { Pencil, Trash2Icon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import CreateCostModal from "@/app/shared/components/GeneralModal/components/CreateCostModal";
type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const CostCard = (props: Props) => {
  const {
    data: costData,
    isLoading: isLoadingCost,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["cost-infinite"],
    queryFn: (p) =>
      costService.getList({
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
  const [isModalCreateCostOpen, setIsModalCreateCostOpen] = useState(false);
  const [isModalUpdateCostOpen, setIsModalUpdateCostOpen] = useState(false);
  const [updateCostId, setUpdateCostId] = useState<string>("");
  const handleSubmitCreateCost = async (data: any) => {
    await costService.createCost(data);
    refetch();
  };
  const _onDeleteCost = async (id: string) => {
    await costService.deleteCost(id);
    refetch();
  };
  const _onOpenModalCreateCost = () => {
    setIsModalCreateCostOpen(true);
  };
  const _onOpenModalUpdateCost = (id: string) => {
    setUpdateCostId(id);
    setIsModalUpdateCostOpen(true);
  };
  const handleCloseModalCreateCost = () => {
    setIsModalCreateCostOpen(false);
  };
  const handleCloseModalUpdateCost = () => {
    setIsModalUpdateCostOpen(false);
  };

  return (
    <DataCard
      title="Cost"
      data={costData?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isModalCreateCostOpen}
      isModalUpdateOpen={isModalUpdateCostOpen}
      updateId={updateCostId}
      handleOpenCreateModal={_onOpenModalCreateCost}
      handleCloseModalCreate={handleCloseModalCreateCost}
      handleCloseModalUpdate={handleCloseModalUpdateCost}
      refetch={refetch}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <div className="flex min-h-[100px] flex-col gap-2">
          {data &&
            data.map((item) => (
              <Tooltip title={`${item.name}`} key={item.id}>
                <div className="flex w-full items-center justify-between">
                  {item.name} -{" "}
                  {item.type === "percentage"
                    ? `${formatDiscountPercentage(item.cost || 0)}`
                    : `${formatCurrency(item.cost || 0)}`}
                  <div className="flex items-center gap-1">
                    <Button
                      type="text"
                      className="aspect-square rounded-full p-0"
                      onClick={() => _onOpenModalUpdateCost(item.id)}
                    >
                      <Pencil className="h-4 w-4 stroke-yellow-500" />
                    </Button>
                    <ButtonDeleteWithPopover
                      title={`Delete ${item.name}?`}
                      trigger={"click"}
                      handleDelete={() => {
                        _onDeleteCost(item.id);
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
        <CreateCostModal
          isModalCreateCostOpen={isModalCreateOpen}
          handleCloseModalCreateCost={handleCloseModalCreate}
          handleSubmitCreateCostForm={handleSubmitCreateCost}
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

export default CostCard;
