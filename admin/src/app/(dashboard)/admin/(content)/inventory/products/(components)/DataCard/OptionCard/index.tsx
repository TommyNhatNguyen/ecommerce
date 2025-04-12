import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useOptions } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useOptions";
import ModalCreateOptions from "@/app/shared/components/GeneralModal/components/ModalCreateOptions";
import UpdateOptionsModal from "@/app/shared/components/GeneralModal/components/ModalUpdateOption";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { optionService } from "@/app/shared/services/variant/optionService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, ColorPicker, Empty, Tree } from "antd";
import { Pencil, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
const OptionsCard = (props: Props) => {
  const [isModalCreateOptionOpen, setIsModalCreateOptionOpen] = useState(false);
  const [isModalUpdateOptionOpen, setIsModalUpdateOptionOpen] = useState(false);
  const [updateOptionId, setUpdateOptionId] = useState<string>("");
  const { handleDeleteOption, loadingDelete: deleteOptionLoading } =
    useOptions();
  const {
    data: options,
    isLoading: isLoadingOptions,
    refetch: refetchOptions,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["options", deleteOptionLoading],
    queryFn: (p) =>
      optionService.getOptionList({
        page: p.pageParam,
        limit: 10,
        include_option_values: true,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
  });
  const _onDeleteOption = async (id: string) => {
    await handleDeleteOption(id);
  };
  const _onOpenModalCreateOption = () => {
    setIsModalCreateOptionOpen(true);
  };
  const _onCloseModalCreateOption = () => {
    setIsModalCreateOptionOpen(false);
  };
  const _onOpenModalUpdateOption = (id: string) => {
    setUpdateOptionId(id);
    setIsModalUpdateOptionOpen(true);
  };
  const _onCloseModalUpdateOption = () => {
    setIsModalUpdateOptionOpen(false);
  };
  return (
    <DataCard
      title="Options"
      data={options?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isModalCreateOptionOpen}
      isModalUpdateOpen={isModalUpdateOptionOpen}
      updateId={updateOptionId}
      handleOpenCreateModal={_onOpenModalCreateOption}
      handleCloseModalCreate={_onCloseModalCreateOption}
      handleCloseModalUpdate={_onCloseModalUpdateOption}
      refetch={refetchOptions}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <div className="flex flex-col gap-2">
          <Tree
            showLine
            selectable={false}
            className="min-h-[100px]"
            treeData={data.map((item) => ({
              title: () => {
                return (
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">
                      {item.name} - {item.option_values?.length} values
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="text"
                        className="aspect-square rounded-full p-0"
                        onClick={() => _onOpenModalUpdateOption(item.id)}
                      >
                        <Pencil className="h-4 w-4 stroke-yellow-500" />
                      </Button>
                      <ButtonDeleteWithPopover
                        title={`Delete ${item.name}?`}
                        trigger={"click"}
                        handleDelete={() => {
                          _onDeleteOption(item.id);
                        }}
                      />
                    </div>
                  </div>
                );
              },
              key: item.id,
              children: item.option_values?.map((option) => ({
                title: () => {
                  const isColor = item.is_color || false;
                  return (
                    <div className="flex items-center justify-between gap-2">
                      {isColor ? (
                        <div className="flex items-center gap-2">
                          <ColorPicker value={option.value} disabled />
                          {" - "}
                          <p>{option.name}</p>
                        </div>
                      ) : (
                        <p>
                          {option.name} - {option.value}
                        </p>
                      )}
                    </div>
                  );
                },
                key: option.id,
              })),
            }))}
          />
        </div>
      )}
      renderCreateModal={(isModalOpen, handleClose, refetch) => (
        <ModalCreateOptions
          isOpen={isModalOpen}
          handleCloseModal={handleClose}
          refetch={refetch}
        />
      )}
      renderUpdateModal={(
        isModalUpdateOpen,
        handleCloseModalUpdate,
        updateId,
        refetch,
      ) => (
        <UpdateOptionsModal
          isOpen={isModalUpdateOpen}
          handleCloseModal={handleCloseModalUpdate}
          refetch={refetch}
          optionId={updateId}
        />
      )}
    />
  );
};

export default OptionsCard;
