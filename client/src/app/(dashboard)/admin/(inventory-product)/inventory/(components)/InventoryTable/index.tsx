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
  Image,
  Popover,
  Tooltip,
  Carousel,
} from "antd";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  MoreHorizontal,
  Pencil,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import React, { Key, useEffect, useState } from "react";
import {
  dataSource,
  discountCampaigns,
  statusOptions,
} from "@/app/constants/seeds";
import { Dayjs } from "dayjs";
import InputAdmin from "@/app/shared/components/InputAdmin";
import { ERROR_MESSAGE } from "@/app/constants/errors";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ImgCrop from "antd-img-crop";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import GeneralModal from "@/app/shared/components/GeneralModal";
import CreateProductModal from "@/app/shared/components/GeneralModal/components/CreateProductModal";
import { CreateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { useInventory } from "@/app/(dashboard)/admin/(inventory-product)/inventory/hooks/useInventory";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productService } from "@/app/shared/services/products/productService";
import { Trash2Icon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import ActionGroup from "@/app/shared/components/ActionGroup";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import {
  formatCurrency,
  formatDiscountPercentage,
  formatNumber,
} from "@/app/shared/utils/utils";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { DataType } from "@/app/(dashboard)/admin/(inventory-product)/inventory/hooks/useInventory";

type InventoryTablePropsType = {
  handleSelectAllRow: (
    selected: boolean,
    selectedRows: DataType[],
    changeRows: DataType[],
  ) => void;
  handleDeleteProduct: (id: string) => Promise<boolean>;
  deleteProductLoading: boolean;
  handleSelectRow: (
    record: DataType,
    selected: boolean,
    selectedRows: DataType[],
  ) => void;
  handleDeleteSelectedProducts: () => Promise<void>;
  handleClearAllSelectedRows: () => void;
  selectedRows: DataType[];
};

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const InventoryTable = ({
  handleSelectRow,
  handleSelectAllRow,
  handleDeleteProduct,
  handleClearAllSelectedRows,
  selectedRows,
  deleteProductLoading,
  handleDeleteSelectedProducts,
}: InventoryTablePropsType) => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [sortedDate, setSortedDate] = useState<Dayjs[] | null>(null);
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryLimit, setInventoryLimit] = useState(10);
  const ButtonDeleteSelected = withDeleteConfirmPopover(
    <Button
      type="primary"
      variant="solid"
      color="danger"
      className="flex items-center gap-2"
      disabled={selectedRows.length === 0}
    >
      <TrashIcon className="h-4 w-4" />
      Delete Selected Products
    </Button>,
  );
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };
  const _onDeleteProduct = async (id: string) => {
    await handleDeleteProduct(id);
  };
  const _onSelectRow = (
    record: DataType,
    selected: boolean,
    selectedRows: DataType[],
  ) => {
    handleSelectRow(record, selected, selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: DataType[],
    changeRows: DataType[],
  ) => {
    handleSelectAllRow(selected, selectedRows, changeRows);
  };
  const _onDeleteSelectedProducts = async () => {
    await handleDeleteSelectedProducts();
  };
  const _onChangeDate = (dates: Dayjs[], dateStrings: string[]) => {
    setSortedDate(dates);
  };
  const _onSubmitFilterDate = () => {
    console.log(sortedDate);
  };
  const _onChangeTable: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  const _onClearFilters = () => {
    setFilteredInfo({});
  };
  const _onClearSort = () => {
    setSortedInfo({});
  };
  const _onClearAll = () => {
    _onClearFilters();
    _onClearSort();
    handleClearAllSelectedRows();
  };
  const _onGenerateTableDataSource = (inventories: ProductModel[]) => {
    let tableDataSource: DataType[] = [];
    inventories.forEach((item) => {
      const images = item.image ? item.image.map((image) => image.url) : [];
      const category = item.category
        ? item.category?.map((category) => category.name)
        : [];
      const discount = item.discount
        ? item.discount.reduce(
            (acc, curr) => acc + (curr.discount_percentage || 0),
            0,
          )
        : 0;
      const totalValue = item.discount
        ? (item.price * (100 - discount)) / 100
        : item.price;
      tableDataSource.push({
        key: item.id,
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        images: images as string[],
        category: category as string[],
        quantity: item.inventory ? item.inventory.quantity || 0 : 0,
        discount: discount,
        totalValue: totalValue,
        status: item.status,
        createdAt: item.created_at,
      });
    });
    return tableDataSource;
  };
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });
  const {
    data: inventories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "inventories",
      deleteProductLoading,
      inventoryPage,
      inventoryLimit,
    ],
    queryFn: () =>
      productService.getProducts({
        page: inventoryPage,
        limit: inventoryLimit,
        includeCategory: true,
        includeDiscount: true,
        includeImage: true,
      }),
    placeholderData: keepPreviousData,
  });
  const { data: inventoriesData, meta } = inventories || {};
  const { limit, total_count, current_page } = meta || {};
  const tableDataSource =
    inventoriesData && _onGenerateTableDataSource(inventoriesData);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: null,
      dataIndex: "images",
      key: "images",
      className: "max-w-[150px] ",
      render: (_, { images }) => {
        return (
          <Image.PreviewGroup
            items={images}
            preview={{
              movable: false,
            }}
          >
            <Carousel autoplay dotPosition="bottom">
              {images.map((item) => (
                <Image
                  src={item}
                  alt="product"
                  width={150}
                  height={150}
                  fallback={defaultImage}
                  className="object-contain"
                />
              ))}
            </Carousel>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      filterSearch: true,
      filters: tableDataSource
        ? tableDataSource.map((item) => ({
            text: item.name,
            value: item.name,
          }))
        : [],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.indexOf(value as string) === 0,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, { category }) => <span>{category}</span>,
      filterSearch: true,
      filters:
        categories &&
        categories.data.map((item) => ({
          text: item.name,
          value: item.name,
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
      render: (_, { price }) => <span>{formatCurrency(price)}</span>,
    },
    {
      title: "In stock",
      key: "quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      sortOrder: sortedInfo.columnKey === "quantity" ? sortedInfo.order : null,
      render: (_, { quantity }) => (
        <span
          className={cn(
            "font-bold",
            quantity === 0 ? "text-red-500" : "text-green-500",
          )}
        >
          {quantity === 0 ? "Out of stock" : formatNumber(quantity)}
        </span>
      ),
    },
    {
      title: "Discount",
      key: "discount",
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
      sortOrder: sortedInfo.columnKey === "discount" ? sortedInfo.order : null,
      render: (_, { discount }) => (
        <span>{formatDiscountPercentage(discount)}</span>
      ),
    },
    {
      title: "Total Value",
      key: "totalValue",
      dataIndex: "totalValue",
      sorter: (a, b) => a.totalValue - b.totalValue,
      sortOrder:
        sortedInfo.columnKey === "totalValue" ? sortedInfo.order : null,
      render: (_, { totalValue }) => <span>{formatCurrency(totalValue)}</span>,
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
          color={status === "ACTIVE" ? "green" : "red"}
          key={status}
          className="capitalize"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, { id }) => (
        <ActionGroup
          handleDelete={() => {
            _onDeleteProduct(id);
          }}
          handleEdit={() => {
            const item =
              inventoriesData && inventoriesData.find((item) => item.id === id);
            console.log(item);
            // setDefaultProductFormData(item);
          }}
        />
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
          <div className="flex items-center gap-2">
            <ButtonDeleteSelected
              handleDelete={_onDeleteSelectedProducts}
              title="Are you sure you want to delete these products?"
              trigger={"click"}
            />
            <Button
              type="primary"
              className="flex items-center gap-2"
              onClick={_onOpenModalCreateProduct}
            >
              <PlusIcon className="h-4 w-4" />
              Add New Product
            </Button>
          </div>
          <div
            className={cn(
              "inventory-page__table-filters-search",
              "flex items-center gap-4",
            )}
          >
            <Button type="default" onClick={_onClearFilters}>
              Clear filters
            </Button>
            <Button type="default" onClick={_onClearSort}>
              Clear sorts
            </Button>
            <Button type="default" onClick={_onClearAll}>
              Clear all
            </Button>
            <div className="flex items-center gap-1">
              <DatePicker.RangePicker
                format={"DD-MM-YYYY"}
                onChange={(dates, dateStrings) => {
                  _onChangeDate(dates as Dayjs[], dateStrings);
                }}
              />
              <Button type="primary" onClick={_onSubmitFilterDate}>
                Filtered
              </Button>
            </div>
          </div>
        </div>
        <div className={cn("inventory-page__table-content", "mt-4")}>
          <Table
            dataSource={tableDataSource as any}
            columns={columns}
            onChange={_onChangeTable}
            rowKey={(record) => record.id}
            rowSelection={{
              onSelect: (record, selected, selectedRows, nativeEvent) =>
                _onSelectRow(record, selected, selectedRows),
              onSelectAll: (selected, selectedRows, changeRows) =>
                _onSelectAllRow(selected, selectedRows, changeRows),
            }}
            pagination={{
              current: current_page,
              pageSize: limit,
              total: total_count,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 30, 40, 50, Number(total_count)],
              onChange: (page, pageSize) => {
                setInventoryPage(page);
                setInventoryLimit(pageSize);
              },
            }}
          />
          {isLoading && <LoadingComponent isLoading={isLoading} />}
        </div>
      </div>
      <CreateProductModal
        isModalCreateProductOpen={isModalCreateProductOpen}
        handleCloseModalCreateProduct={handleCloseModalCreateProduct}
        refetch={refetch}
      />
    </>
  );
};

export default InventoryTable;
