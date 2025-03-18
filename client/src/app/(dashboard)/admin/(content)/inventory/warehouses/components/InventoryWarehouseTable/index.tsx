import { warehouseService } from '@/app/shared/services/warehouse/warehouseService';
import { cn } from '@/app/shared/utils/utils';
import { AlignJustify, Download, FilePlus, Plus } from 'lucide-react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { Button, Checkbox, Dropdown, Table } from 'antd';
import { RefreshCcw } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer';
import { useIntl } from 'react-intl';
import { WAREHOUSE_COLUMNS_MENU } from '@/app/(dashboard)/admin/(content)/inventory/warehouses/components/InventoryWarehouseTable/columns/columnsMenu';
import { warehouseColumns } from '@/app/(dashboard)/admin/(content)/inventory/warehouses/components/InventoryWarehouseTable/columns/inventoryWarehouseColumns';

type Props = {}

const InventoryWarehouseTable = (props: Props) => {
  const { ref, inView } = useInView();
  const intl = useIntl();
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const {
    data: warehouseData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["warehouse_with_inventory"],
    queryFn: ({ pageParam = 1 }) => {
      return warehouseService.getList({
        page: pageParam,
        limit: 10,
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
  const warehouses = useMemo(() => {
    return warehouseData?.pages?.flatMap((page) => page.data) || [];
  }, [warehouseData]);
  const newWarehouseColumns = useMemo(() => {
    return warehouseColumns(intl)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["warehouse"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);
  // Event handlers
  const _onRefetch = () => refetch();
  const _onSelectColumns = (id: string, keys: string[]) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [id]: keys,
    }));
  };
  useEffect(() => {
    if (warehouses && warehouses.length > 0) {
      setSelectedColumns({
        warehouse: WAREHOUSE_COLUMNS_MENU,
      });
    }
  }, [warehouses]);
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
              num_rows: warehouses?.length,
              num_total_rows: warehouseData?.pages?.[0]?.meta?.total_count,
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
                  <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "warehouse_columns" })}
                    </p>
                    <Checkbox.Group
                      options={WAREHOUSE_COLUMNS_MENU.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["warehouse"]}
                      onChange={(keys) => _onSelectColumns("warehouse", keys)}
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
          dataSource={warehouses}
          columns={newWarehouseColumns}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={"bg-slate-100"}
          loading={isFetchingNextPage}
          scroll={{ x: "100%" }}
          // expandable={{
          //   expandRowByClick: true,
          //   expandedRowRender: (record, index) => {
          //     return (
          //       <>
          //         <Table
          //           key={`${record.id}-${index}`}
          //           // dataSource={record.variant}
          //           // columns={newVariantColumns}
          //           rowKey={(record) => record.id}
          //           // onRow={(record) => {
          //           //   return {
          //           //     onClick: () => {
          //           //       setProductDetail(record);
          //           //     },
          //           //   };
          //           // }}
          //           pagination={false}
          //         />
          //       </>
          //     );
          //   },
          // }}
        />
        <div className="h-10 w-full" ref={ref}></div>
      </div>
    </div>
  );
}

export default InventoryWarehouseTable;