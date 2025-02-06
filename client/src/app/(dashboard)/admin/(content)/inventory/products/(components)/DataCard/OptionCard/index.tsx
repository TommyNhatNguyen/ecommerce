import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useOptions } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useOptions";
import { ButtonDeleteWithPopover } from "@/app/shared/components/Button";
import CreateOptionsModal from "@/app/shared/components/GeneralModal/components/CreateOptionsModal";
import { optionService } from "@/app/shared/services/variant/optionService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, ColorPicker, Empty, Tree } from "antd";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const OptionsCard = (props: Props) => {
  const [isModalCreateOptionOpen, setIsModalCreateOptionOpen] = useState(false);
  const { handleDeleteOption, loadingDelete: deleteOptionLoading } =
    useOptions();
  const {
    data: options,
    isLoading: isLoadingOptions,
    refetch: refetchOptions,
  } = useQuery({
    queryKey: ["options", deleteOptionLoading],
    queryFn: () =>
      optionService.getOptionList({
        include_option_values: true,
      }),
    placeholderData: keepPreviousData,
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
  return (
    <DataCard
      title="Options"
      data={options?.data || []}
      isModalCreateOpen={isModalCreateOptionOpen}
      isModalUpdateOpen={false}
      updateId=""
      handleOpenCreateModal={_onOpenModalCreateOption}
      handleCloseModalCreate={_onCloseModalCreateOption}
      handleCloseModalUpdate={() => {}}
      refetch={refetchOptions}
      renderComponent={(data) => (
        <div className="flex flex-col gap-2">
          <Tree
            showLine
            selectable={false}
            treeData={data.map((item) => ({
              title: () => {
                return (
                  <p className="font-semibold">
                    {item.name} - {item.option_values?.length} values
                  </p>
                );
              },
              key: item.id,
              children: item.option_values?.map((option) => ({
                title: () => {
                  const isColor = item.is_color || false;
                  return (
                    <div>
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
                      <div className="flex items-center gap-2">
                        <Button
                          type="text"
                          className="aspect-square rounded-full p-0"
                        >
                          <Pencil className="h-4 w-4 stroke-yellow-500" />
                        </Button>
                        <ButtonDeleteWithPopover
                          title={`Delete ${option.name}?`}
                          trigger={"click"}
                          handleDelete={() => {
                            _onDeleteOption(option.id);
                          }}
                        />
                      </div>
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
        <CreateOptionsModal
          isOpen={isModalOpen}
          handleCloseModal={handleClose}
          refetch={refetch}
        />
      )}
      renderUpdateModal={() => null}
    />
  );
};

export default OptionsCard;
