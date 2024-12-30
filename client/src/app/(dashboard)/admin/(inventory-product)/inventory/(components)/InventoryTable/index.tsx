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
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [sortedDate, setSortedDate] = useState<Dayjs[] | null>(null);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDiscountCampaign, setSelectedDiscountCampaign] = useState<
    string[]
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const checkAll = categories.length === selectedCategories.length;
  const indeterminate =
    selectedCategories.length > 0 &&
    selectedCategories.length < categories.length;
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const _onCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
    reset();
  };
  const _onConfirmCreateProduct: SubmitHandler<any> = (data) => {
    console.log("Confirm create product", data);
    _onCloseModalCreateProduct();
  };
  const _onCancelCreateProduct = () => {
    _onCloseModalCreateProduct();
  };
  const _onChangeCategories = (list: string[]) => {
    setSelectedCategories(list);
  };
  const _onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    setSelectedCategories(
      e.target.checked ? categories.map((item) => item.value) : [],
    );
  };
  const _onChangeDiscountCampaign = (list: string[]) => {
    setSelectedDiscountCampaign(list);
  };
  const _onChangeStatus = (list: string[]) => {
    setSelectedStatus(list);
  };
  const _onClearCategories = () => {
    setSelectedCategories([]);
  };
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
  const _renderTitleModalCreateProduct = () => {
    return (
      <div className="relative pb-2">
        <h1 className="text-2xl font-bold">Create Product</h1>
        <div className="absolute -left-[10%] bottom-0 h-[1px] w-lvw bg-zinc-500/30"></div>
      </div>
    );
  };
  const _renderContentModalCreateProduct = () => {
    return (
      <div className="form-create-product my-4">
        <div className="flex w-full flex-1 flex-shrink-0 flex-col gap-4">
          <Controller
            control={control}
            name="productName"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field, formState: { errors } }) => (
              <InputAdmin
                label="Product Name"
                required={true}
                placeholder="Product Name"
                error={errors.productName?.message as string}
                {...field}
              />
            )}
          />
          <InputAdmin
            label="Category"
            placeholder="Category"
            required={true}
            customComponent={(props, ref) => (
              <Select
                options={categories}
                placement="bottomLeft"
                value={selectedCategories}
                onClear={_onClearCategories}
                placeholder="Select Category"
                allowClear={true}
                mode="multiple"
                onChange={_onChangeCategories}
                dropdownRender={(menu) => (
                  <>
                    <div className="flex flex-col gap-2 p-2">
                      <Checkbox
                        className="font-medium"
                        value="all"
                        onChange={_onCheckAllChange}
                        checked={checkAll}
                        indeterminate={indeterminate}
                      >
                        <span>All</span>
                      </Checkbox>
                      <div className="h-[1px] w-full bg-zinc-500/30"></div>
                      <Checkbox.Group
                        options={categories}
                        value={selectedCategories}
                        onChange={_onChangeCategories}
                        className="flex flex-col gap-2"
                      />
                    </div>
                  </>
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <InputAdmin
                label="Description"
                placeholder="Description"
                customComponent={() => <Input.TextArea rows={4} />}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="price"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Price"
                required={true}
                placeholder="Price"
                error={errors.price?.message as string}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="stock"
            rules={{
              required: {
                value: true,
                message: ERROR_MESSAGE.REQUIRED,
              },
            }}
            render={({ field }) => (
              <InputAdmin
                label="Stock"
                required={true}
                placeholder="Stock"
                error={errors.stock?.message as string}
                {...field}
              />
            )}
          />
          <InputAdmin
            label="Discount Campaign"
            placeholder="Discount Campaign"
            customComponent={() => (
              <Select
                options={discountCampaigns}
                placeholder="Select Discount Campaign"
                allowClear={true}
                value={selectedDiscountCampaign}
                onChange={_onChangeDiscountCampaign}
              />
            )}
          />
          <InputAdmin
            label="Status"
            placeholder="Status"
            required={true}
            customComponent={() => (
              <Select
                options={statusOptions}
                placeholder="Select Status"
                value={selectedStatus}
                onChange={_onChangeStatus}
              />
            )}
          />
        </div>
        <div className="mt-4">
          <InputAdmin
            label="Product Image"
            required={true}
            placeholder="Product Image"
            customComponent={() => (
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                // fileList={fileList}
                // onChange={onChange}
                // onPreview={onPreview}
              >
                <PlusIcon className="h-4 w-4" />
              </Upload>
            )}
          />
        </div>
      </div>
    );
  };
  const _renderFooterModalCreateProduct = () => {
    return (
      <div className="flex items-center justify-end gap-2">
        <Button type="default" onClick={_onCancelCreateProduct}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(_onConfirmCreateProduct)}
        >
          Create
        </Button>
      </div>
    );
  };
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
      <Modal
        open={isModalCreateProductOpen}
        onCancel={_onCloseModalCreateProduct}
        onOk={_onCloseModalCreateProduct}
        centered={true}
        closable={true}
        mask={true}
        maskClosable={true}
        footer={_renderFooterModalCreateProduct()}
        title={_renderTitleModalCreateProduct()}
        className="min-w-[60%]"
      >
        {_renderContentModalCreateProduct()}
      </Modal>
    </>
  );
};

export default InventoryTable;
