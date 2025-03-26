import { Table } from "antd";
import { Checkbox, Dropdown } from "antd";
import {
  AlignJustify,
  Download,
  FilePlus,
  LucidePackage,
  LucidePackageCheck,
  LucidePackageMinus,
  LucidePackagePlus,
  LucidePackageSearch,
  LucidePackageX,
  Truck,
} from "lucide-react";
import { Plus } from "lucide-react";
import { cn } from "@/app/shared/utils/utils";
import { Button } from "antd";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import { keepPreviousData } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { invoicesService } from "@/app/shared/services/invoices/invoicesService";
import { invoicesColumns } from "@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesTable/columns/invoicesColumns";
import { INVOICES_COLUMNS_MENU } from "@/app/(dashboard)/admin/(content)/inventory/invoices/components/InvoicesTable/columns/columnsMenu";
import { ModalRefType } from "@/app/shared/components/GeneralModal";
import { InventoryInvoiceType } from "@/app/shared/interfaces/invoices/invoices.dto";
import ModalCreateInvoices, {
  ModalCreateInvoicesRefType,
} from "@/app/shared/components/GeneralModal/components/ModalCreateInvoices";
import ModalCreateTransferInvoices from "@/app/shared/components/GeneralModal/components/ModalCreateTransferInvoices";
import ModalCreateCheckInvoice from "@/app/shared/components/GeneralModal/components/ModalCreateCheckInvoice";

type Props = {};

const InvoicesTable = (props: Props) => {
  const { ref, inView } = useInView();
  const intl = useIntl();
  const modalCreateInvoicesRef = useRef<ModalCreateInvoicesRefType>();
  const modalCreateTransferInvoicesRef = useRef<ModalRefType>();
  const modalCreateCheckInvoiceRef = useRef<ModalRefType>();
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
  const _onOpenModalCreateInvoices = (type: InventoryInvoiceType) => {
    modalCreateInvoicesRef.current?.handleOpenModal(type);
  };
  const _onOpenModalCreateTransferInvoices = () => {
    modalCreateTransferInvoicesRef.current?.handleOpenModal();
  };
  const _onOpenModalCreateCheckInvoice = () => {
    modalCreateCheckInvoiceRef.current?.handleOpenModal();
  };
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
                  key: "import_inventory",
                  label: intl.formatMessage({ id: "import_inventory" }),
                  icon: <LucidePackagePlus width={16} height={16} />,
                  onClick: () =>
                    _onOpenModalCreateInvoices(
                      "IMPORT_INVOICE" as InventoryInvoiceType,
                    ),
                },
                {
                  key: "discard_inventory",
                  label: intl.formatMessage({ id: "discard_inventory" }),
                  icon: <LucidePackageX width={16} height={16} />,
                  onClick: () =>
                    _onOpenModalCreateInvoices(
                      "DISCARD_INVOICE" as InventoryInvoiceType,
                    ),
                },
                {
                  key: "transfer_inventory",
                  label: intl.formatMessage({ id: "transfer_inventory" }),
                  icon: <Truck width={16} height={16} />,
                  onClick: () => _onOpenModalCreateTransferInvoices(),
                },
                {
                  key: "update_cost_inventory",
                  label: intl.formatMessage({
                    id: "update_cost_inventory",
                  }),
                  icon: <LucidePackage width={16} height={16} />,
                  onClick: () =>
                    _onOpenModalCreateInvoices(
                      "UPDATE_COST_INVOICE" as InventoryInvoiceType,
                    ),
                },
                {
                  key: "check_inventory",
                  label: intl.formatMessage({ id: "check_inventory" }),
                  icon: <LucidePackageSearch width={16} height={16} />,
                  onClick: () => _onOpenModalCreateCheckInvoice(),
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
        />
        <div className="h-10 w-full" ref={ref}></div>
      </div>
      <ModalCreateInvoices ref={modalCreateInvoicesRef} refetch={_onRefetch} />
      <ModalCreateTransferInvoices
        ref={modalCreateTransferInvoicesRef}
        refetch={_onRefetch}
      />
      <ModalCreateCheckInvoice
        ref={modalCreateCheckInvoiceRef}
        refetch={_onRefetch}
      />
    </div>
  );
};

export default InvoicesTable;
