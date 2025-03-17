import { variantServices } from "@/app/shared/services/variant/variantService";
import { cn } from "@/app/shared/utils/utils";
import { Table } from "antd";
import { AlignJustify, Download, Plus } from "lucide-react";
import { FilePlus } from "lucide-react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { Button, Dropdown } from "antd";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import { inventoryColumns } from "@/app/(dashboard)/admin/(content)/inventory/components/InventoryTable/columns/inventoryColumns";

type Props = {};

const InventoryTable = (props: Props) => {
  const { ref, inView } = useInView();
  const intl = useIntl();
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const {
    data: variantData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["variant_with_inventory"],
    queryFn: ({ pageParam = 1 }) => {
      return variantServices.getList({
        page: pageParam,
        limit: 10,
        include_product_sellable: true,
        include_inventory: true,
        include_warehouse: true,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  const variants = useMemo(() => {
    return variantData?.pages?.flatMap((page) => page.data) || [];
  }, [variantData]);
  const newInventoryColumns = useMemo(() => {
    return inventoryColumns(intl)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["inventory"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);
  console.log("🚀 ~ variants ~ variants:", variants);
  // Event handlers
  const _onRefetch = () => refetch();
  const _onSelectColumns = (id: string, keys: string[]) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [id]: keys,
    }));
  };
  useEffect(() => {
    if (variants && variants.length > 0) {
      setSelectedColumns({
        inventory: inventoryColumns(intl)?.map((item) => item?.key as string) || [],
      });
    }
  }, [variants]);
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Tải lại */}
        <div className="left">
          {intl.formatMessage(
            { id: "showing" },
            {
              num_rows: variants?.length,
              num_total_rows: variantData?.pages?.[0]?.meta?.total_count,
            },
          )}
        </div>
        <div className="right flex items-center gap-2">
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
            // onClick={_onOpenModalCreateProduct}
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
                  {/* <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "product_columns" })}
                    </p>
                    <Checkbox.Group
                      options={PRODUCTS_COLUMNS.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["product"]}
                      onChange={(keys) => _onSelectColumns("product", keys)}
                      className="mt-2 flex flex-wrap gap-2"
                    />
                  </div>
                  <Divider />
                  <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "variant_columns" })}
                    </p>
                    <Checkbox.Group
                      options={VARIANT_COLUMNS.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["variant"]}
                      onChange={(keys) => _onSelectColumns("variant", keys)}
                      className="mt-2 flex flex-wrap gap-2"
                    />
                  </div> */}
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
          dataSource={variants}
          columns={newInventoryColumns}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={"bg-slate-100"}
          loading={isFetchingNextPage}
          expandable={{
            expandRowByClick: true,
            expandedRowRender: (record, index) => {
              return (
                <>
                  <Table
                    key={`${record.id}-${index}`}
                    // dataSource={record.variant}
                    // columns={newVariantColumns}
                    rowKey={(record) => record.id}
                    // onRow={(record) => {
                    //   return {
                    //     onClick: () => {
                    //       setProductDetail(record);
                    //     },
                    //   };
                    // }}
                    pagination={false}
                  />
                </>
              );
            },
          }}
        />
        <div className="h-10 w-full" ref={ref}></div>
      </div>
    </div>
  );
};

export default InventoryTable;
