import { brandColumns } from "@/app/(dashboard)/admin/(content)/inventory/products/brands/components/BrandTable/columns/brandColumns";
import { ModalRefType } from "@/app/shared/components/GeneralModal";
import { brandService } from "@/app/shared/services/brands/brandService";
import { cn } from "@/app/shared/utils/utils";
import { keepPreviousData } from "@tanstack/react-query";
import {
  AlignJustify,
  Download,
  FilePlus,
  Plus,
  Trash2Icon,
} from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import { Button, Checkbox, Dropdown, Table } from "antd";
import { BRAND_COLUMNS } from "@/app/(dashboard)/admin/(content)/inventory/products/brands/components/BrandTable/columns/columnsMenu";
import { useBrand } from "@/app/(dashboard)/admin/(content)/inventory/products/brands/hooks/useBrand";
import ModalCreateBrand from "@/app/shared/components/GeneralModal/components/ModalCreateBrand";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import ModalUpdateBrand from "@/app/shared/components/GeneralModal/components/ModalUpdateBrand";

type Props = {
  limit: number;
};

const BrandTable = ({ limit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<string>("");
  const intl = useIntl();
  const { ref, inView } = useInView();
  const {
    handleCreateBrand,
    loadingCreateBrand,
    handleUpdateBrand,
    loadingUpdateBrand,
    handleDeleteBrand,
    loadingDeleteBrand,
  } = useBrand();
  const modalCreateBrandRef = useRef<ModalRefType>(null);
  const modalUpdateBrandRef = useRef<ModalRefType>(null);
  const {
    data: brandsData,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-brands"],
    queryFn: ({ pageParam = 1 }) => {
      return brandService.getBrands({
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
  const _onChangeStatus = async (id: string, status: ModelStatus) => {
    await handleUpdateBrand(id, { status });
    refetch();
  };
  const loading = useMemo(() => {
    return (
      loadingCreateBrand ||
      loadingUpdateBrand ||
      loadingDeleteBrand ||
      isLoading ||
      isFetching
    );
  }, [
    loadingCreateBrand,
    loadingUpdateBrand,
    loadingDeleteBrand,
    isLoading,
    isFetching,
  ]);
  const brands = useMemo(() => {
    return brandsData?.pages?.flatMap((page) => page.data) || [];
  }, [brandsData]);

  const _onOpenModalUpdateBrand = (id: string) => {
    modalUpdateBrandRef.current?.handleOpenModal();
    setSelectedUpdateItem(id);
  };

  const _onDeleteBrand = (id: string) => {
    handleDeleteBrand([id], _onRefetch);
  };

  const newBrandsColumn = useMemo(() => {
    return brandColumns(
      intl,
      _onChangeStatus,
      _onOpenModalUpdateBrand,
      _onDeleteBrand,
    )?.map((item) => ({
      ...item,
      hidden: !selectedColumns["brand"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);

  const _onOpenModalCreateBrand = () => {
    modalCreateBrandRef.current?.handleOpenModal();
  };

  const _onRefetch = () => {
    refetch();
  };

  const _onSelectColumns = (id: string, keys: string[]) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [id]: keys,
    }));
  };

  const _onSelectBrands = (selectedRowKeys: string[], selectedRows: any[]) => {
    setSelectedBrands(selectedRowKeys);
  };

  const _onDeleteBrands = async () => {
    await handleDeleteBrand(selectedBrands);
    setSelectedBrands([]);
    refetch();
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (brands && brands?.length > 0) {
      setSelectedColumns({
        brand: [
          ...(
            brandColumns(
              intl,
              _onChangeStatus,
              _onOpenModalUpdateBrand,
              _onDeleteBrand,
            ) || []
          ).map((item) => item?.key as string),
        ],
      });
    }
  }, [brands]);

  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Tải lại */}
        <div className="left">
          {intl.formatMessage(
            { id: "showing" },
            {
              num_rows: brands?.length,
              num_total_rows: brandsData?.pages?.[0]?.meta?.total_count,
            },
          )}
        </div>
        <div className="right flex items-center gap-2">
          {selectedBrands.length > 0 && (
            <Button
              type="primary"
              disabled={selectedBrands.length === 0}
              color="danger"
              variant="solid"
              icon={<Trash2Icon width={16} height={16} />}
              onClick={_onDeleteBrands}
            >
              {intl.formatMessage({ id: "delete_brands" })}
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
            onClick={_onOpenModalCreateBrand}
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
                      options={BRAND_COLUMNS.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["brand"]}
                      onChange={(keys) => _onSelectColumns("brand", keys)}
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
            selectedRowKeys: selectedBrands,
            onChange: (selectedRowKeys, selectedRows) => {
              _onSelectBrands(selectedRowKeys as string[], selectedRows);
            },
          }}
          dataSource={brands}
          columns={newBrandsColumn}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={"bg-slate-100"}
          loading={loading}
        />
        <div className="h-10 w-full" ref={ref}></div>
      </div>
      <ModalCreateBrand
        handleCreateBrand={(data) => handleCreateBrand(data, _onRefetch)}
        ref={modalCreateBrandRef}
        loading={loadingCreateBrand}
        refetch={_onRefetch}
      />
      <ModalUpdateBrand
        updateBrandId={selectedUpdateItem}
        ref={modalUpdateBrandRef}
        loading={loadingUpdateBrand}
        refetch={_onRefetch}
      />
    </div>
  );
};

export default BrandTable;
