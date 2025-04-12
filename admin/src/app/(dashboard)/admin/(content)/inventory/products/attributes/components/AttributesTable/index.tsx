import { Divider, Table } from "antd";
import { Checkbox } from "antd";
import { Dropdown } from "antd";
import { useAttributes } from "@/app/(dashboard)/admin/(content)/inventory/products/attributes/hooks/useAttributes";
import { ModalRefType } from "@/app/shared/components/GeneralModal";
import { optionService } from "@/app/shared/services/variant/optionService";
import { cn } from "@/app/shared/utils/utils";
import { AlignJustify, Download, Plus } from "lucide-react";
import { FilePlus } from "lucide-react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "antd";
import { RefreshCcw } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useIntl } from "react-intl";
import {
  optionsColumns,
  optionsValuesColumns,
} from "@/app/(dashboard)/admin/(content)/inventory/products/attributes/components/AttributesTable/columns/attributeColumns";
import {
  OPTION_COLUMNS,
  OPTION_VALUES_COLUMNS,
} from "@/app/(dashboard)/admin/(content)/inventory/products/attributes/components/AttributesTable/columns/columnsMenu";
import ModalCreateOptions from "@/app/shared/components/GeneralModal/components/ModalCreateOptions";
import ModalUpdateOption from "@/app/shared/components/GeneralModal/components/ModalUpdateOption";

type Props = {
  limit: number;
};

const AttributesTable = ({ limit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<string>("");
  const intl = useIntl();
  const { ref, inView } = useInView();
  const modalCreateOptionRef = useRef<ModalRefType>(null);
  const modalUpdateOptionRef = useRef<ModalRefType>(null);
  const {
    data: optionData,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["infinite-options"],
    queryFn: ({ pageParam = 1 }) => {
      return optionService.getOptionList({
        include_option_values: true,
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
  const options = useMemo(() => {
    return optionData?.pages?.flatMap((page) => page.data) || [];
  }, [optionData]);
  const _onOpenModalUpdateOption = (id: string) => {
    modalUpdateOptionRef.current?.handleOpenModal();
    setSelectedUpdateItem(id);
  };
  const newOptionsColumns = useMemo(() => {
    return optionsColumns(intl, _onOpenModalUpdateOption)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["options"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);
  const newOptionValuesColumns = useMemo(() => {
    return optionsValuesColumns(intl)?.map((item) => ({
      ...item,
      hidden: !selectedColumns["options-values"]?.includes(item?.key as string),
    }));
  }, [selectedColumns]);
  const _onOpenModalCreateOptions = () => {
    modalCreateOptionRef.current?.handleOpenModal();
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
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);
  useEffect(() => {
    if (options && options?.length > 0) {
      setSelectedColumns({
        options: [
          ...(optionsColumns(intl, _onOpenModalUpdateOption) || []).map(
            (item) => item?.key as string,
          ),
        ],
        "options-values": [
          ...(optionsValuesColumns(intl) || []).map(
            (item) => item?.key as string,
          ),
        ],
      });
    }
  }, [options]);
  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        {/* Tải lại */}
        <div className="left">
          {intl.formatMessage(
            { id: "showing" },
            {
              num_rows: options?.length,
              num_total_rows: optionData?.pages?.[0]?.meta?.total_count,
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
            onClick={_onOpenModalCreateOptions}
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
                      {intl.formatMessage({ id: "attribute_columns" })}
                    </p>
                    <Checkbox.Group
                      options={OPTION_COLUMNS.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["options"]}
                      onChange={(keys) => _onSelectColumns("options", keys)}
                      className="mt-2 flex flex-wrap gap-2"
                    />
                  </div>
                  <Divider />
                  <div>
                    <p className="text-md font-roboto-bold">
                      {intl.formatMessage({ id: "attribute_values_columns" })}
                    </p>
                    <Checkbox.Group
                      options={OPTION_VALUES_COLUMNS.map((item) => ({
                        label: intl.formatMessage({ id: item }),
                        value: item,
                      }))}
                      value={selectedColumns["options-values"]}
                      onChange={(keys) =>
                        _onSelectColumns("options-values", keys)
                      }
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
          dataSource={options}
          columns={newOptionsColumns}
          rowKey={(record) => record.id}
          pagination={false}
          rowClassName={"bg-slate-100"}
          loading={isFetching}
          expandable={{
            expandRowByClick: true,
            expandedRowRender: (record, index) => {
              return (
                <Table
                  key={`${record.id}-${index}`}
                  rowKey={(record) => record.id}
                  dataSource={
                    record.option_values?.map((item) => ({
                      ...item,
                      is_color: record.is_color,
                    })) || []
                  }
                  columns={newOptionValuesColumns}
                  pagination={false}
                />
              );
            },
          }}
        />
        <div className="h-10 w-full" ref={ref}></div>
      </div>
      <ModalCreateOptions refetch={_onRefetch} ref={modalCreateOptionRef} />
      <ModalUpdateOption
        refetch={_onRefetch}
        ref={modalUpdateOptionRef}
        updateOptionId={selectedUpdateItem}
      />
    </div>
  );
};

export default AttributesTable;
