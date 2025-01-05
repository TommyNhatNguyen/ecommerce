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
  Slider,
  Card,
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
import { useInventory } from "@/app/(dashboard)/admin/inventory/hooks/useInventory";
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
import { DataType } from "@/app/(dashboard)/admin/inventory/hooks/useInventory";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { DateString } from "@/app/shared/types/datestring.model";
import UpdateProductModal from "@/app/shared/components/GeneralModal/components/UpdateProductModal";

type InventoryTablePropsType = {
  handleSelectAllRow: (
    selected: boolean,
    selectedRows: DataType[],
    changeRows: DataType[],
  ) => void;
  handleSoftDeleteProduct: (id: string) => Promise<ProductModel | null>;
  softDeleteProductLoading: boolean;
  handleSelectRow: (
    record: DataType,
    selected: boolean,
    selectedRows: DataType[],
  ) => void;
  handleClearAllSelectedRows: () => void;
  selectedRows: DataType[];
  handleUpdateStatus: (id: string, status: ModelStatus) => Promise<boolean>;
  updateStatusLoading: boolean;
  handleSoftDeleteSelectedProducts: () => Promise<void>;
  softDeleteSelectedProductsLoading: boolean;
};

type OnChange = NonNullable<TableProps<DataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const InventoryTable = ({
  handleSelectRow,
  handleSelectAllRow,
  handleClearAllSelectedRows,
  handleSoftDeleteProduct,
  softDeleteProductLoading,
  handleUpdateStatus,
  updateStatusLoading,
  selectedRows,
  handleSoftDeleteSelectedProducts,
  softDeleteSelectedProductsLoading,
}: InventoryTablePropsType) => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [sortedDate, setSortedDate] = useState<
    [start: DateString | null | undefined, end: DateString | null | undefined]
  >([null, null]);
  const [renderDate, setRenderDate] = useState<
    [Dayjs | null | undefined, Dayjs | null | undefined]
  >([null, null]);
  const [isFilterDate, setIsFilterDate] = useState(false);
  const [isModalCreateProductOpen, setIsModalCreateProductOpen] =
    useState(false);
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryLimit, setInventoryLimit] = useState(10);
  const [isModalUpdateProductOpen, setIsModalUpdateProductOpen] =
    useState(false);
  const [updateProductId, setUpdateProductId] = useState<string>("");
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
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });
  const {
    data: inventories,
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: [
      "inventories",
      softDeleteProductLoading,
      inventoryPage,
      inventoryLimit,
      updateStatusLoading,
      softDeleteSelectedProductsLoading,
      isFilterDate,
    ],
    queryFn: () =>
      productService.getProducts({
        page: inventoryPage,
        limit: inventoryLimit,
        includeCategory: true,
        includeDiscount: true,
        includeImage: true,
        fromCreatedAt: sortedDate[0] || undefined,
        toCreatedAt: sortedDate[1] || undefined,
      }),
    placeholderData: keepPreviousData,
  });
  const { data: inventoriesData, meta } = inventories || {};
  const { limit, total_count, current_page } = meta || {};
  const _onOpenModalCreateProduct = () => {
    setIsModalCreateProductOpen(true);
  };
  const handleCloseModalCreateProduct = () => {
    setIsModalCreateProductOpen(false);
  };
  const _onOpenModalUpdateProduct = (id: string) => {
    setUpdateProductId(id);
    setIsModalUpdateProductOpen(true);
  };

  const handleCloseModalUpdateProduct = () => {
    setIsModalUpdateProductOpen(false);
  };
  const _onSoftDeleteProduct = async (id: string) => {
    await handleSoftDeleteProduct(id);
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
  const _onSoftDeleteSelectedProducts = async () => {
    await handleSoftDeleteSelectedProducts();
  };
  const _onChangeDate = (dates: Dayjs[], dateStrings: string[]) => {
    setRenderDate([dates[0], dates[1]]);
    setSortedDate([dateStrings[0] as DateString, dateStrings[1] as DateString]);
  };
  const _onSubmitFilterDate = () => {
    setIsFilterDate((prev) => !prev);
  };
  const _onChangeTable: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  const _onClearFilters = () => {
    setFilteredInfo({});
    setSortedDate([null, null]);
    setRenderDate([null, null]);
    setIsFilterDate(false);
  };
  const _onClearSort = () => {
    setSortedInfo({});
  };
  const _onClearAll = () => {
    _onClearFilters();
    _onClearSort();
    handleClearAllSelectedRows();
  };
  const _onSelectStatus = async (status: ModelStatus, id: string) => {
    await handleUpdateStatus(id, status);
  };
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
      filters:
        categories &&
        categories.data.map((item) => ({
          text: item.name,
          value: item.name,
        })),
      filteredValue: filteredInfo.category || null,
      onFilter: (value, record) =>
        record.category?.map((item) => item.name).indexOf(value as string) ===
        0,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === "price" ? sortedInfo.order : null,
      render: (_, { price }) => <span>{formatCurrency(price)}</span>,
      // filterDropdown: () => {
      //   return (
      //     <div className="flex flex-col gap-2 rounded-md p-2">
      //       <Slider
      //         step={1000000}
      //         min={0}
      //         max={100000000}
      //         onChange={(value) => {
      //           console.log(value);
      //         }}
      //       />
      //       <div className="flex items-center justify-end gap-1">
      //         <Button type="primary" onClick={() => {}}>
      //           Confirm
      //         </Button>
      //         <Button type="primary" onClick={() => {}}>
      //           Clear
      //         </Button>
      //         <Button type="primary" onClick={() => {}}>
      //           Close
      //         </Button>
      //       </div>
      //     </div>
      //   );
      // },
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
                  {/* <Button
                    type="primary"
                    className="w-full"
                    onClick={() => _onUpdateStatus(id)}
                  >
                    Submit
                  </Button> */}
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
            _onSoftDeleteProduct(id);
          }}
          handleEdit={() => {
            _onOpenModalUpdateProduct(id);
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
              handleDelete={_onSoftDeleteSelectedProducts}
              title="Are you sure you want to delete these products?"
              trigger={"click"}
              isWithDeleteConfirmPopover={false}
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
                format={"YYYY-MM-DD"}
                value={renderDate}
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
        refetch={refetchProducts}
      />
      <UpdateProductModal
        isModalUpdateProductOpen={isModalUpdateProductOpen}
        handleCloseModalUpdateProduct={handleCloseModalUpdateProduct}
        updateProductId={updateProductId}
        refetch={refetchProducts}
      />
    </>
  );
};

export default InventoryTable;
