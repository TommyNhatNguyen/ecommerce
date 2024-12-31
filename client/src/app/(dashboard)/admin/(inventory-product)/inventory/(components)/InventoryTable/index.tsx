"use client";
import { MenuItem } from "@/app/shared/types/antd.model";
import { cn } from "@/lib/utils";
import {
  Button,
  Dropdown,
  Input,
  Checkbox,
  Menu,
  DatePicker,
  Table,
  TableProps,
  Tag,
  Modal,
  Form,
  Select,
  CheckboxProps,
  Divider,
  Upload,
  Tabs,
  TabsProps,
} from "antd";
import { PlusIcon } from "lucide-react";
import React, { Key, useState } from "react";
import {
  categories,
  dataSource,
  discountCampaigns,
} from "@/app/constants/seeds";
import { Dayjs } from "dayjs";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ImgCrop from "antd-img-crop";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import GeneralModal from "@/app/shared/components/GeneralModal";
import CreateProductModal from "@/app/shared/components/GeneralModal/components/CreateProductModal";
import { CreateProductDTO } from "@/app/shared/interfaces/create-product.dto";

type Props = {};

// Define filter options
const statusOptions = [
  { label: "Publish", value: "publish" },
  { label: "Unpublish", value: "unpublish" },
];
interface DataType {
  key: string;
  productName: string;
  category: string;
  price: number;
  stock: number;
  discount: number;
  totalValue: number;
  status: "publish" | "unpublish";
  createdAt: string;
}
type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const InventoryTable = (props: Props) => {
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] = useState(false);
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };
  const handleSubmitCreateProductForm = (data: CreateProductDTO) => {
    console.log("Submit create product form", data);
  };
  /**
   * -----------------------
   * TABLE
   * -----------------------
   */
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [sortedDate, setSortedDate] = useState<Dayjs[] | null>(null);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const _onSelectRow = (selectedRowKeys: Key[], selectedRows: DataType[]) => {
    console.log(selectedRowKeys, selectedRows);
    setSelectedRows(selectedRows);
  };
  const _handleChangeDate = (dates: Dayjs[], dateStrings: string[]) => {
    setSortedDate(dates);
  };
  const _handleSubmitFilterDate = () => {
    console.log(sortedDate);
  };
  const _handleChangeTable: OnChange = (pagination, filters, sorter) => {
    console.log("Pagination:", pagination);
    console.log("Filters:", filters);
    console.log("Sorter:", sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  const clearFilters = () => {
    setFilteredInfo({});
  };
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSelectedRows([]);
  };
  const clearSort = () => {
    setSortedInfo({});
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      filterSearch: true,
      filters: dataSource.map((item) => ({
        text: item.productName,
        value: item.productName,
      })),
      filteredValue: filteredInfo.productName || null,
      onFilter: (value, record) =>
        record.productName.indexOf(value as string) === 0,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filterSearch: true,
      filters: categories.map((item) => ({
        text: item.label,
        value: item.value,
      })),
      filteredValue: filteredInfo.category || null,
      onFilter: (value, record) =>
        record.category.indexOf(value as string) === 0,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
    },
    {
      title: "In Stock",
      key: "stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
      sortOrder: sortedInfo.columnKey === "stock" ? sortedInfo.order : null,
      render: (_, { stock }) => (
        <span
          className={cn(
            "font-bold",
            stock === 0 ? "text-red-500" : "text-green-500",
          )}
        >
          {stock === 0 ? "Out of stock" : stock}
        </span>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
      sortOrder: sortedInfo.columnKey === "discount" ? sortedInfo.order : null,
    },
    {
      title: "Total Value",
      key: "totalValue",
      dataIndex: "totalValue",
      sorter: (a, b) => a.totalValue - b.totalValue,
      sortOrder:
        sortedInfo.columnKey === "totalValue" ? sortedInfo.order : null,
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (_, { createdAt }) => (
        <span>
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      filters: statusOptions.map((option) => ({
        text: option.label,
        value: option.value,
      })),
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      render: (_, { status }) => (
        <Tag
          color={status === "publish" ? "green" : "red"}
          key={status}
          className="capitalize"
        >
          {status}
        </Tag>
      ),
    },
  ];
  return (
    <>
      <div
        className={cn("inventory-page__table", "mt-4 rounded-lg bg-white p-4")}
      >
        <div
          className={cn(
            "inventory-page__table-filters",
            "flex items-center justify-between gap-2",
          )}
        >
          <Button
            type="primary"
            className="flex items-center gap-2"
            onClick={_onOpenModalCreateProduct}
          >
            <PlusIcon className="h-4 w-4" />
            Add New Product
          </Button>
          <div
            className={cn(
              "inventory-page__table-filters-search",
              "flex items-center gap-4",
            )}
          >
            <Button type="default" onClick={clearFilters}>
              Clear filters
            </Button>
            <Button type="default" onClick={clearSort}>
              Clear sorts
            </Button>
            <Button type="default" onClick={clearAll}>
              Clear all
            </Button>
            <div className="flex items-center gap-1">
              <DatePicker.RangePicker
                format={"DD-MM-YYYY"}
                onChange={(dates, dateStrings) => {
                  _handleChangeDate(dates as Dayjs[], dateStrings);
                }}
              />
              <Button type="primary" onClick={_handleSubmitFilterDate}>
                Filtered
              </Button>
            </div>
          </div>
        </div>
        <div className={cn("inventory-page__table-content", "mt-4")}>
          <Table
            dataSource={dataSource as DataType[]}
            columns={columns}
            onChange={_handleChangeTable}
            rowSelection={{
              onChange: _onSelectRow,
            }}
          />
        </div>
      </div>
      <CreateProductModal
        isModalCreateProductOpen={isModalCreateProductOpen}
        handleCloseModalCreateProduct={handleCloseModalCreateProduct}
        handleSubmitCreateProductForm={handleSubmitCreateProductForm}
      />
    </>
  );
};

export default InventoryTable;
