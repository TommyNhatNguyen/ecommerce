"use client";
import { Table } from "antd";
import { Checkbox, Divider, Dropdown } from "antd";
import {
  AlignJustify,
  Download,
  FilePlus,
  Plus,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/app/shared/utils/utils";
import { RefreshCcw } from "lucide-react";
import { Button } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { CATEGORY_COLUMNS } from "@/app/(dashboard)/admin/(content)/inventory/products/categories/components/CategoryTable/columns/columnsMenu";
import { useInView } from "react-intersection-observer";
import { useCategory } from "@/app/(dashboard)/admin/(content)/inventory/products/categories/hooks/useCategory";
import { categoryColumns } from "@/app/(dashboard)/admin/(content)/inventory/products/categories/components/CategoryTable/columns/categoryColumns";
import { keepPreviousData } from "@tanstack/react-query";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useInfiniteQuery } from "@tanstack/react-query";
import ModalCreateCategory from "@/app/shared/components/GeneralModal/components/ModalCreateCategory";
import { ModalRefType } from "@/app/shared/components/GeneralModal";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import ModalUpdateCategory from "@/app/shared/components/GeneralModal/components/ModalUpdateCategory";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";

type Props = {
  limit: number;
};

const CategoryTable = ({ limit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const intl = useIntl();
  const { ref, inView } = useInView();
  const {
    handleCreateCategory,
    loadingCreateCategory,
    selectedCategory,
    handleSelectCategory,
    handleUpdateCategory,
    loadingUpdateCategory,
    handleDeleteCategories,
    selectedUpdateItem,
    handleSelectUpdateItem,
    handleDeleteCategory,
  } = useCategory();
  const modalCreateCategoryRef = useRef<ModalRefType>(null);
  const modalUpdateCategoryRef = useRef<ModalRefType>(null);
  const {
    data: categoriesData,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-categories"],
    queryFn: ({ pageParam = 1 }) => {
      return categoriesService.getCategories({
        include_image: true,
        page: pageParam,
        limit: limit,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  const _onRefetch = () => {
    refetch();
  };
  const _onChangeStatus = async (id: string, status: ModelStatus) => {
    await handleUpdateCategory(id, { status });
    refetch();
  };
  const _onOpenModalCreateCategory = () => {
    modalCreateCategoryRef.current?.handleOpenModal();
  };
  const _onOpenModalUpdateCategory = (id: string) => {
    modalUpdateCategoryRef.current?.handleOpenModal();
    handleSelectUpdateItem(id);
  };
  const _onDeleteCategory = (id: string) => {
    handleDeleteCategory(id, _onRefetch);
  };
  const categories = useMemo(() => {
    return categoriesData?.pages?.flatMap((page) => page.data) || [];
  }, [categoriesData]);

  const newCategoryColumns = useMemo(() => {
    return categoryColumns(
      intl,
      _onChangeStatus,
      _onOpenModalUpdateCategory,
      _onDeleteCategory,
    )?.map((item) => ({
      ...item,
      hidden: !selectedColumns["category"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);

  const _onSelectColumns = (id: string, keys: string[]) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [id]: keys,
    }));
  };
  const _onDeleteCategories = async () => {
    await handleDeleteCategories(selectedCategory);
    refetch();
  };
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);
  useEffect(() => {
    if (categories && categories?.length > 0) {
      setSelectedColumns({
        category: [
          ...(
            categoryColumns(
              intl,
              _onChangeStatus,
              _onOpenModalUpdateCategory,
              _onDeleteCategory,
            ) || []
          ).map((item) => item?.key as string),
        ],
      });
    }
  }, [categories]);
  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Tải lại */}
        <div className="left">
          {intl.formatMessage(
            { id: "showing" },
            {
              num_rows: categories?.length,
              num_total_rows: categoriesData?.pages?.[0]?.meta?.total_count,
            },
          )}
        </div>
        <div className="right flex items-center gap-2">
          {selectedCategory.length > 0 && (
            <Button
              type="primary"
              disabled={selectedCategory.length === 0}
              color="danger"
              variant="solid"
              icon={<Trash2Icon width={16} height={16} />}
              onClick={_onDeleteCategories}
            >
              {intl.formatMessage({ id: "delete_categories" })}
            </Button>
          )}
          <Button
            type="primary"
            icon={
              <RefreshCcw
                width={16}
                height={16}
                className={cn(isLoading && "animate-spin duration-300")}
              />
            }
            onClick={_onRefetch}
          />
          <Button
            type="primary"
            icon={<Plus width={16} height={16} />}
            onClick={_onOpenModalCreateCategory}
          >
            {intl.formatMessage({ id: "add_new" })}
          </Button>
          <Button
            type="primary"
            disabled
            icon={<FilePlus width={16} height={16} />}
          >
            <p>
              {intl.formatMessage({ id: "import_excel" })}(
              {intl.formatMessage({ id: "coming_soon" })})
            </p>
          </Button>
          <Button
            type="primary"
            disabled
            icon={<Download width={16} height={16} />}
          >
            <p>
              {intl.formatMessage({ id: "export_excel" })}(
              {intl.formatMessage({ id: "coming_soon" })})
            </p>
          </Button>
          <Dropdown
            trigger={["click"]}
            dropdownRender={() => {
              return (
                <div className="min-w-[200px] max-w-[200px] rounded-sm bg-custom-white p-2">
                  <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "product_columns" })}
                    </p>
                    <Checkbox.Group
                      options={CATEGORY_COLUMNS.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["category"]}
                      onChange={(keys) => _onSelectColumns("category", keys)}
                      className="mt-2 flex flex-wrap gap-2"
                    />
                  </div>
                </div>
              );
            }}
          >
            <Button
              type="primary"
              icon={<AlignJustify width={16} height={16} />}
            />
          </Dropdown>
        </div>
      </div>
      <div>
        <Table
          rowSelection={{
            selectedRowKeys: selectedCategory,
            onChange: (selectedRowKeys, selectedRows) => {
              handleSelectCategory(selectedRowKeys as string[], selectedRows);
            },
          }}
          dataSource={categories}
          columns={newCategoryColumns}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={"bg-slate-100"}
          loading={isFetching}
        />
        <div className="h-10 w-full" ref={ref}></div>
      </div>
      <ModalCreateCategory
        handleSubmitCreateCategoryForm={(data) =>
          handleCreateCategory(data, _onRefetch)
        }
        ref={modalCreateCategoryRef}
        loading={loadingCreateCategory}
      />
      <ModalUpdateCategory
        ref={modalUpdateCategoryRef}
        loading={loadingUpdateCategory}
        updateCategoryId={selectedUpdateItem}
        refetch={_onRefetch}
      />
    </div>
  );
};

export default CategoryTable;
