import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useCategory } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useCategory";
import { ButtonDeleteWithPopover } from "@/app/shared/components/Button";
import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import UpdateCategoryModal from "@/app/shared/components/GeneralModal/components/UpdateCategoryModal";
import {
  CreateCategoryDTO,
  CreateCategoryFormDTO,
} from "@/app/shared/interfaces/categories/category.dto";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button, Empty, Tooltip } from "antd";
import { Pencil } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const CategoryCard = (props: Props) => {
  const [isModalCreateCategoryOpen, setIsModalCreateCategoryOpen] =
    useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState<string>("");
  const [isModalUpdateCategoryOpen, setIsModalUpdateCategoryOpen] =
    useState(false);
  const {
    loading: createCategoryLoading,
    hanldeCreateCategory,
    hanldeDeleteCategory,
    loadingDelete: deleteCategoryLoading,
  } = useCategory();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories", createCategoryLoading, deleteCategoryLoading],
    queryFn: () => categoriesService.getCategories({}, {}),
    placeholderData: keepPreviousData,
  });
  const _onDeleteCategory = async (id: string) => {
    await hanldeDeleteCategory(id);
  };
  const _onOpenModalUpdateCategory = (id: string) => {
    setUpdateCategoryId(id);
    setIsModalUpdateCategoryOpen(true);
  };

  const handleCloseModalUpdateCategory = () => {
    setIsModalUpdateCategoryOpen(false);
  };

  const _onOpenModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(true);
  };

  const handleCloseModalCreateCategory = () => {
    setIsModalCreateCategoryOpen(false);
  };
  const handleSubmitCreateCategory = async (data: CreateCategoryFormDTO) => {
    const payload: CreateCategoryDTO = {
      name: data.name,
      description: data.description,
      image_id: data.imageId,
      status: data.status || "ACTIVE",
    };
    await hanldeCreateCategory(payload);
    refetchCategories();
  };
  return (
    <DataCard
      title="Category"
      data={categories?.data || []}
      isModalCreateOpen={isModalCreateCategoryOpen}
      isModalUpdateOpen={isModalUpdateCategoryOpen}
      updateId={updateCategoryId}
      handleOpenCreateModal={_onOpenModalCreateCategory}
      handleCloseModalCreate={handleCloseModalCreateCategory}
      handleCloseModalUpdate={handleCloseModalUpdateCategory}
      refetch={refetchCategories}
      renderComponent={(data) => (
        <div className="flex flex-col gap-2">
          {data.map((item) => (
            <Tooltip title={item.description} key={item.id}>
              <div className="flex w-full items-center justify-between">
                {item.name}
                <div className="flex items-center gap-1">
                  <Button
                    type="text"
                    className="aspect-square rounded-full p-0"
                    onClick={() => _onOpenModalUpdateCategory(item.id)}
                  >
                    <Pencil className="h-4 w-4 stroke-yellow-500" />
                  </Button>
                  <ButtonDeleteWithPopover
                    title={`Delete ${item.name}?`}
                    trigger={"click"}
                    handleDelete={() => {
                      _onDeleteCategory(item.id);
                    }}
                  />
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      )}
      renderCreateModal={(isModalOpen, handleClose, refetch) => (
        <CreateCategoryModal
          isModalCreateCategoryOpen={isModalOpen}
          handleCloseModalCreateCategory={handleClose}
          handleSubmitCreateCategoryForm={handleSubmitCreateCategory}
          loading={createCategoryLoading}
        />
      )}
      renderUpdateModal={(isModalOpen, handleClose, updateId, refetch) => (
        <UpdateCategoryModal
          isModalUpdateCategoryOpen={isModalOpen}
          handleCloseModalUpdateCategory={handleClose}
          updateCategoryId={updateId}
          refetch={refetch}
        />
      )}
    />
  );
};

export default CategoryCard;
