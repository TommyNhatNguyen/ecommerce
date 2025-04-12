import { CheckInventoryInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { InputNumber, Table, TableProps } from "antd";
import {
  Controller,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Control } from "react-hook-form";
import React, { forwardRef, useEffect } from "react";
import { FieldErrors } from "react-hook-form";
import { UseFormRegister } from "react-hook-form";
import { useIntl } from "react-intl";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { InventoryCheckSummaryData } from "../../hooks/useCreateCheck";
type Props = {
  data: (InventoryModel | undefined)[];
  loading?: boolean;
  checkInventoryData: {
    [key: string]: number;
  };
  register: UseFormRegister<CheckInventoryInvoicesCreateDTO>;
  errors: FieldErrors<CheckInventoryInvoicesCreateDTO>;
  control: Control<CheckInventoryInvoicesCreateDTO>;
  setValue: UseFormSetValue<CheckInventoryInvoicesCreateDTO>;
  watch: UseFormWatch<CheckInventoryInvoicesCreateDTO>;
  handleChangeInventoryCheckSummaryData: (
    data: InventoryCheckSummaryData,
  ) => void;
} & TableProps<any>;

const InventoryCheckTable = ({
  data = [],
  loading,
  checkInventoryData,
  register,
  errors,
  control,
  setValue,
  watch,
  handleChangeInventoryCheckSummaryData,
  ...props
}: Props) => {
  const intl = useIntl();
  const modifiedData = data.map((item, index) => ({
    index: index + 1,
    sku: item?.product_sellable.variant?.sku,
    product_name: item?.product_sellable.variant?.product?.name,
    system_quantity: item?.warehouse?.[0]?.inventory_warehouse?.quantity,
    actual_quantity: watch(`inventory_data.${index}.actual_quantity`),
    difference_quantity:
      (item?.warehouse?.[0]?.inventory_warehouse?.quantity || 0) -
      watch(`inventory_data.${index}.actual_quantity`),
    difference_amount:
      ((item?.warehouse?.[0]?.inventory_warehouse?.quantity || 0) -
        watch(`inventory_data.${index}.actual_quantity`)) *
      (item?.warehouse?.[0]?.inventory_warehouse?.cost || 0),
    cost: item?.warehouse?.[0]?.inventory_warehouse?.cost,
    inventory_id: item?.id,
  }));
  useEffect(() => {
    handleChangeInventoryCheckSummaryData({
      total_actual_quantity: modifiedData.reduce(
        (acc, curr) => acc + curr.actual_quantity,
        0,
      ),
      total_difference_quantity: modifiedData.reduce(
        (acc, curr) => acc + curr.difference_quantity,
        0,
      ),
      total_difference_amount: modifiedData.reduce(
        (acc, curr) => acc + curr.difference_amount,
        0,
      ),
    });
  }, [modifiedData]);

  const columns: TableProps<any>["columns"] = [
    {
      key: "index",
      title: intl.formatMessage({ id: "index" }),
      dataIndex: "index",
    },
    {
      key: "sku",
      title: intl.formatMessage({ id: "sku" }),
      dataIndex: "sku",
    },
    {
      key: "product_name",
      title: intl.formatMessage({ id: "product_name" }),
      dataIndex: "product_name",
    },
    {
      key: "system_quantity",
      title: intl.formatMessage({ id: "system_quantity" }),
      dataIndex: "system_quantity",
    },
    {
      key: "actual_quantity",
      title: intl.formatMessage({ id: "actual_quantity" }),
      dataIndex: "actual_quantity",
      render: (_, {}, index) => {
        return (
          <Controller
            control={control}
            name={`inventory_data.${index}.actual_quantity`}
            render={({ field }) => {
              return <InputNumber required={true} {...field} />;
            }}
          />
        );
      },
    },
    {
      key: "difference_quantity",
      title: intl.formatMessage({ id: "difference_quantity" }),
      dataIndex: "difference_quantity",
      render: (_, { difference_quantity }) => {
        return formatNumber(difference_quantity);
      },
    },
    {
      key: "difference_amount",
      title: intl.formatMessage({ id: "difference_amount" }),
      dataIndex: "difference_amount",
      render: (_, { difference_amount }) => {
        return formatCurrency(difference_amount);
      },
    },
  ];

  return (
    <Table
      dataSource={modifiedData}
      columns={columns}
      rowKey={(record) => record.id}
      pagination={false}
      rowClassName={"bg-slate-100"}
      loading={loading}
      className="w-full"
      {...props}
    />
  );
};

export default forwardRef(InventoryCheckTable);
