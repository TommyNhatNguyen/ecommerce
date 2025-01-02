"use client";
const defaultImg =
  "data:image/png;base64,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";
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

type InventoryTablePropsType = {
  handleDeleteProduct: (id: string) => Promise<boolean>;
  deleteProductLoading: boolean;
};

interface DataType {
  id: string;
  key: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  discount: number;
  totalValue: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string;
  images: string[];
}
type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const InventoryTable = ({
  handleDeleteProduct,
  deleteProductLoading,
}: InventoryTablePropsType) => {
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };

  /**
   * -----------------------
   * TABLE
   * -----------------------
   */
  const [defaultProductFormData, setDefaultProductFormData] =
    useState<CreateProductDTO>();
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [sortedDate, setSortedDate] = useState<Dayjs[] | null>(null);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

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

  const _onDeleteProduct = async (id: string) => {
    await handleDeleteProduct(id);
  };
  const _onSelectRow = (
    record: DataType,
    selected: boolean,
    selectedRows: DataType[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: DataType[],
    changeRows: DataType[],
  ) => {
    setSelectedRows(selectedRows);
  };
  console.log("🚀 ~ selectedRows:", selectedRows);
  const _onDeleteSelectedProducts = async () => {
    if (selectedRows.length === 0) return;
    console.log(selectedRows);
    await Promise.all(
      selectedRows.map(async (item) => await _onDeleteProduct(item.id)),
    );
    setSelectedRows([]);
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
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryLimit, setInventoryLimit] = useState(10);
  const [inventoryHasMore, setInventoryHasMore] = useState(false);
  const {
    data: inventories,
    isLoading,
    isFetching,
    isPlaceholderData,
    isPending,
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
  useEffect(() => {
    if (inventories) {
      const isHasMore =
        inventories.meta.total_page > inventories.meta.current_page;
      setInventoryHasMore(isHasMore);
    }
  }, [inventories]);
  const { data: inventoriesData, meta } = inventories || {};
  const { limit, total_count, current_page, total_page } = meta || {};
  const tableDataSource =
    inventoriesData &&
    inventoriesData.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      images: item.image ? item.image.map((image) => image.url) : [],
      category: item.category
        ? item.category?.map((category) => category.name)
        : [],
      quantity: item.inventory ? item.inventory.quantity : 0,
      discount: item.discount
        ? item.discount.reduce(
            (acc, curr) => acc + (curr.discount_percentage || 0),
            0,
          )
        : 0,
      totalValue: item.discount
        ? (item.price *
            item.discount.reduce(
              (acc, curr) => acc + (curr.discount_percentage || 0),
              0,
            )) /
          100
        : item.price,
      status: item.status,
      createdAt: item.created_at,
    }));
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
                  fallback={defaultImg}
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
            dataSource={tableDataSource as any}
            columns={columns}
            onChange={_handleChangeTable}
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
