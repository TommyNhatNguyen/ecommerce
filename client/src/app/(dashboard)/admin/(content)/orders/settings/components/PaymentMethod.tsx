import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import CreatePaymentMethodModal from "@/app/shared/components/GeneralModal/components/CreatePaymentMethod";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { CreatePaymentMethodDTO } from "@/app/shared/interfaces/payment/payment.dto";
import { paymentService } from "@/app/shared/services/payment/paymentServcie";
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
const PaymentMethod = (props: Props) => {
  const {
    data: paymentMethods,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["payment-methods"],
    queryFn: (p) =>
      paymentService.getListPaymentMethod({
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
  const [updatePaymentMethodId, setUpdatePaymentMethodId] =
    useState<string>("");
  const _onOpenModalCreateShipping = () => {
    setIsOpenModalCreateShipping(true);
  };
  const handleCloseModalCreateShipping = () => {
    setIsOpenModalCreateShipping(false);
  };
  const handleCloseModalUpdateShipping = () => {
    setIsOpenModalUpdateShipping(false);
  };
  const _onDeletePaymentMethod = async (id: string) => {
    await paymentService.deletePaymentMethod(id);
    refetch();
  };
  const _onOpenModalUpdateShipping = (id: string) => {
    setUpdatePaymentMethodId(id);
    setIsOpenModalUpdateShipping(true);
  };
  const handleSubmitCreatePaymentMethod = async (
    data: CreatePaymentMethodDTO,
  ) => {
    await paymentService.createPaymentMethod(data);
    refetch();
  };
  return (
    <DataCard
      title="Payment Method"
      data={paymentMethods?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isOpenModalCreateShipping}
      isModalUpdateOpen={isOpenModalUpdateShipping}
      updateId={updatePaymentMethodId}
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
                      _onDeletePaymentMethod(item.id);
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
        <CreatePaymentMethodModal
          isModalCreatePaymentMethodOpen={isModalCreateOpen}
          handleCloseModalCreatePaymentMethod={handleCloseModalCreate}
          handleSubmitCreatePaymentMethod={handleSubmitCreatePaymentMethod}
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

export default PaymentMethod;
