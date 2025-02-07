import DataCard from "@/app/(dashboard)/admin/(content)/inventory/products/(components)/DataCard";
import { useCategory } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useCategory";
import CreateCategoryModal from "@/app/shared/components/GeneralModal/components/CreateCategoryModal";
import UpdateCategoryModal from "@/app/shared/components/GeneralModal/components/UpdateCategoryModal";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import {
  CreateCategoryDTO,
  CreateCategoryFormDTO,
} from "@/app/shared/interfaces/categories/category.dto";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Button, Empty, Tooltip } from "antd";
import { Pencil, Trash2Icon } from "lucide-react";
import React, { useState } from "react";

type Props = {};
const ButtonDeleteWithPopover = withDeleteConfirmPopover(
  <Button type="text" className="aspect-square rounded-full p-0">
    <Trash2Icon className="h-4 w-4 stroke-red-500" />
  </Button>,
);
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
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["categories", createCategoryLoading, deleteCategoryLoading],
    queryFn: (p) =>
      categoriesService.getCategories({ page: p.pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
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
      data={categories?.pages.flatMap((page) => page.data) || []}
      isModalCreateOpen={isModalCreateCategoryOpen}
      isModalUpdateOpen={isModalUpdateCategoryOpen}
      updateId={updateCategoryId}
      handleOpenCreateModal={_onOpenModalCreateCategory}
      handleCloseModalCreate={handleCloseModalCreateCategory}
      handleCloseModalUpdate={handleCloseModalUpdateCategory}
      refetch={refetchCategories}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      renderComponent={(data) => (
        <div className="flex min-h-[100px] flex-col gap-2">
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
