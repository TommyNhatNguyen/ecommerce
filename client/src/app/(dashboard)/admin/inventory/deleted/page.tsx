"use client";
import { ProductModel } from "@/app/shared/models/products/products.model";
import {
  DataType,
  useInventory,
} from "@/app/(dashboard)/admin/inventory/hooks/useInventory";
import {
  cn,
  formatNumber,
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import {
  Button,
  Carousel,
  Image,
  Select,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import React, { useState } from "react";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import ActionGroup from "@/app/shared/components/ActionGroup";
import { keepPreviousData } from "@tanstack/react-query";
import { productService } from "@/app/shared/services/products/productService";
import { useQuery } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { statusOptions } from "@/app/constants/seeds";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { PlusIcon, TrashIcon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { useInventoryDelete } from "@/app/(dashboard)/admin/inventory/hooks/useInventoryDelete";

type DeletedProductPagePropsType = {};
type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const DeletedProductPage = ({}: DeletedProductPagePropsType) => {
  const {
    handleUpdateStatus,
    handleDeleteProduct,
    handleDeleteSelectedProducts,
    handleSelectAllRow,
    handleSelectRow,
    selectedRows,
    updateStatusLoading,
    deleteProductLoading,
    deleteSelectedProductsLoading,
  } = useInventoryDelete();
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [sortedDate, setSortedDate] = useState<Dayjs[] | null>(null);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryLimit, setInventoryLimit] = useState(10);
  const { data: inventories, isLoading } = useQuery({
    queryKey: [
      "inventories",
      inventoryPage,
      inventoryLimit,
      updateStatusLoading,
      deleteProductLoading,
      deleteSelectedProductsLoading,
    ],
    queryFn: () =>
      productService.getProducts({
        status: "DELETED",
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
  const _onGenerateTableDataSource = (inventories: ProductModel[]) => {
    let tableDataSource: DataType[] = [];
    inventories.forEach((item) => {
      const images =
        item.image && item.image.length > 0
          ? item.image.map((image) => image.url)
          : [defaultImage];
      const totalValue =
        item.price && item.inventory?.quantity
          ? item.price * (item.inventory?.quantity || 1)
          : item.price;
      tableDataSource.push({
        key: item.id,
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        images: images as string[],
        category: item.category,
        quantity: item.inventory ? item.inventory.quantity || 0 : 0,
        discounts: item.discount,
        totalValue: totalValue,
        status: item.status,
        createdAt: item.created_at,
      });
    });
    return tableDataSource;
  };
  const _onSelectStatus = async (status: ModelStatus, id: string) => {
    await handleUpdateStatus(id, status);
  };
  const _onDeleteProduct = async (id: string) => {
    await handleDeleteProduct(id);
  };
  const _onDeleteSelectedProducts = async () => {
    await handleDeleteSelectedProducts();
  };
  const _onChangeTable: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
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
                  key={item}
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
      render: (_, { category }) => {
        return (
          <div className="flex flex-col gap-2">
            {category?.map((item, index) => (
              <Tooltip
                title={item?.description}
                popupVisible={item?.description ? true : false}
                key={item?.id}
              >
                <Tag>
                  <span className="capitalize">{item?.name}</span>
                </Tag>
              </Tooltip>
            ))}
          </div>
        );
      },
      filterSearch: true,
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
      key: "discounts",
      dataIndex: "discounts",
      sorter: (a, b) =>
        (a.discounts?.length || 0) - (b.discounts?.length || 0) ||
        (a.discounts?.reduce(
          (acc, curr) => acc + (curr.discount_percentage || 0),
          0,
        ) || 0) -
          (b.discounts?.reduce(
            (acc, curr) => acc + (curr.discount_percentage || 0),
            0,
          ) || 0),
      sortOrder: sortedInfo.columnKey === "discounts" ? sortedInfo.order : null,
      render: (_, { discounts }) => {
        return (
          <div className="flex flex-col gap-2">
            {discounts?.map((discount, index) => (
              <Tooltip
                title={discount?.description}
                popupVisible={discount?.description ? true : false}
                key={discount?.id}
              >
                <Tag>
                  <span className="capitalize">{discount?.name} - </span>
                  <span>
                    {formatDiscountPercentage(
                      discount?.discount_percentage || 0,
                    )}
                  </span>
                </Tag>
              </Tooltip>
            ))}
          </div>
        );
      },
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
      render: (_, { status, id }) => {
        console.log(status);
        return (
          <Select
            options={statusOptions}
            defaultValue={status}
            disabled={updateStatusLoading}
            onSelect={(value) => {
              _onSelectStatus(value, id);
            }}
            className="min-w-[120px]"
            labelRender={(option) => {
              const textColor =
                option.value === "ACTIVE" ? "text-green-500" : "text-red-500";
              return (
                <div className={cn("font-semibold capitalize", `${textColor}`)}>
                  {option.label}
                </div>
              );
            }}
            dropdownRender={(menu) => {
              return (
                <div className="min-w-fit">
                  <div>{menu}</div>
                </div>
              );
            }}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, { id }) => (
        <ActionGroup
          isWithDeleteConfirmPopover={false}
          deleteConfirmPopoverProps={{
            title: "Are you sure you want to delete this product?",
          }}
          handleDelete={() => {
            _onDeleteProduct(id);
          }}
        />
      ),
    },
  ];
  return (
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
  );
};

export default DeletedProductPage;
