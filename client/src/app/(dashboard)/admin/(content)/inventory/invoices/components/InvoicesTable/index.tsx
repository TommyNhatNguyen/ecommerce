import { Table } from "antd";
import { Checkbox, Dropdown } from "antd";
import {
  AlignJustify,
  Download,
  FilePlus,
  LucidePackage,
  LucidePackageMinus,
  LucidePackagePlus,
  LucidePackageX,
  Truck,
} from "lucide-react";
import { Plus } from "lucide-react";
import { cn } from "@/app/shared/utils/utils";
import { Button } from "antd";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import { keepPreviousData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { invoicesService } from "@/app/shared/services/invoices/invoicesService";
import { invoicesColumns } from "@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesTable/columns/invoicesColumns";
import { INVOICES_COLUMNS_MENU } from "@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesTable/columns/columnsMenu";

type Props = {};

const InvoicesTable = (props: Props) => {
  const { ref, inView } = useInView();
  const intl = useIntl();
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const {
    data: invoicesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["invoices_infinite"],
    queryFn: ({ pageParam = 1 }) => {
      return invoicesService.getList({
        page: pageParam,
        limit: 10,
        include_inventory: true,
        include_warehouse: true,
        include_product: true,
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
  const invoices = useMemo(() => {
    return invoicesData?.pages?.flatMap((page) => page.data) || [];
  }, [invoicesData]);
  const newInvoicesColumns = useMemo(() => {
    return invoicesColumns(intl)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["invoices"]?.includes(item?.key as string),
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
    if (invoices && invoices.length > 0) {
      setSelectedColumns({
        invoices: INVOICES_COLUMNS_MENU,
      });
    }
  }, [invoices]);
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
              num_rows: invoices?.length,
              num_total_rows: invoicesData?.pages?.[0]?.meta?.total_count,
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
          <Dropdown
            menu={{
              items: [
                {
                  key: "create_import_invoice",
                  label: intl.formatMessage({ id: "create_import_invoice" }),
                  icon: <LucidePackagePlus width={16} height={16} />,
                },
                {
                  key: "create_discard_invoice",
                  label: intl.formatMessage({ id: "create_discard_invoice" }),
                  icon: <LucidePackageX width={16} height={16} />,
                },
                {
                  key: "create_update_cost_invoice",
                  label: intl.formatMessage({
                    id: "create_update_cost_invoice",
                  }),
                  icon: <LucidePackage width={16} height={16} />,
                },
                {
                  key: "create_transfer_invoice",
                  label: intl.formatMessage({ id: "create_transfer_invoice" }),
                  icon: <Truck width={16} height={16} />,
                  disabled: true,
                },
              ],
            }}
          >
            <Button type="primary" icon={<Plus width={16} height={16} />}>
              {intl.formatMessage({ id: "create_invoice" })}
            </Button>
          </Dropdown>
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
                      {intl.formatMessage({ id: "invoices_columns" })}
                    </p>
                    <Checkbox.Group
                      options={INVOICES_COLUMNS_MENU.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["invoices"]}
                      onChange={(keys) => _onSelectColumns("invoices", keys)}
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
          dataSource={invoices}
          columns={newInvoicesColumns}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={"bg-slate-100"}
          loading={isFetchingNextPage}
          scroll={{ x: "100%" }}
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

export default InvoicesTable;
