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
  Eye,
  EyeClosed,
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
import { useInventory } from "@/app/(dashboard)/admin/(content)/inventory/hooks/useInventory";
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
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { DateString } from "@/app/shared/types/datestring.model";
import UpdateProductModal from "@/app/shared/components/GeneralModal/components/UpdateProductModal";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { STOCK_STATUS } from "@/app/constants/stock-status";
import { DISCOUNT_TYPE } from "@/app/constants/enum";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";

type InventoryTablePropsType = {
  handleSelectAllRow: (
    selected: boolean,
    selectedRows: ProductModel[],
    changeRows: ProductModel[],
  ) => void;
  handleSoftDeleteProduct: (id: string) => Promise<ProductModel | null>;
  softDeleteProductLoading: boolean;
  handleSelectRow: (
    record: ProductModel,
    selected: boolean,
    selectedRows: ProductModel[],
  ) => void;
  handleClearAllSelectedRows: () => void;
  selectedRows: ProductModel[];
  handleUpdateStatus: (id: string, status: ModelStatus) => Promise<boolean>;
  updateStatusLoading: boolean;
  handleSoftDeleteSelectedProducts: () => Promise<void>;
  softDeleteSelectedProductsLoading: boolean;
};

type OnChange = NonNullable<TableProps<ProductModel>["onChange"]>;
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
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
        includeImage: true,
        includeVariantOption: true,
        includeVariantOptionType: true,
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
    record: ProductModel,
    selected: boolean,
    selectedRows: ProductModel[],
  ) => {
    handleSelectRow(record, selected, selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: ProductModel[],
    changeRows: ProductModel[],
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

  const columns: TableProps<ProductModel>["columns"] = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      filterSearch: true,
      filters: inventoriesData
        ? inventoriesData.map((item) => ({
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
      title: "Variant",
      key: "variant",
      dataIndex: "variant",
      render: (_, { variant }) => {
        return variant?.length || 0;
      },
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
            _onSoftDeleteProduct(id);
          }}
          handleEdit={() => {
            _onOpenModalUpdateProduct(id);
          }}
        />
      ),
    },
  ];

  const variantColumns: TableProps<VariantProductModel>["columns"] = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      className: "max-w-[150px]",
      minWidth: 150,
      render: (_, { product_sellable }) => {
        const images = product_sellable?.image || [];
        return (
          <Image.PreviewGroup
            items={images.map((item) => item.url)}
            preview={{
              movable: false,
            }}
          >
            <Carousel autoplay dotPosition="bottom">
              {images.map((item) => (
                <Image
                  className="object-contain object-center"
                  src={item.url}
                  alt={item.url}
                  key={item.id}
                />
              ))}
            </Carousel>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: "Variant Name",
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => (
        <Tooltip title={name}>
          <span>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: "Options",
      dataIndex: "options",
      key: "options",
      render: (_, { option_values }) => {
        return (
          <div className="flex w-full flex-col gap-2">
            {option_values?.map((item) => (
              <Tag key={item.id}>
                {item.options.name} - {item.name}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, { product_sellable }) => (
        <Tooltip title={formatCurrency(product_sellable?.price || 0)}>
          {formatCurrency(product_sellable?.price || 0)}
        </Tooltip>
      ),
    },
    {
      title: "Discount",
      key: "discounts",
      dataIndex: "discounts",
      render: (_, { product_sellable }) => {
        const discounts = product_sellable?.discount || [];
        const total_discounts = discounts.reduce(
          (acc, discount) => acc + discount.amount,
          0,
        );
        return (
          <div className="flex flex-col gap-2">
            {discounts?.map((discount, index) => (
              <Tooltip
                title={discount?.description}
                popupVisible={discount?.description ? true : false}
                key={discount?.id}
              >
                <Tag>
                  <span>
                    {discount?.name} -{" "}
                    {discount?.type === DISCOUNT_TYPE.PERCENTAGE
                      ? formatDiscountPercentage(discount?.amount || 0)
                      : formatCurrency(discount?.amount || 0)}
                  </span>
                </Tag>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: "Price After Discount",
      dataIndex: "price_after_discount",
      key: "price_after_discount",
      render: (_, { product_sellable }) => (
        <Tooltip
          title={formatCurrency(product_sellable?.price_after_discounts || 0)}
        >
          {formatCurrency(product_sellable?.price_after_discounts || 0)}
        </Tooltip>
      ),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (_, { product_sellable }) => (
        <Tooltip title={formatCurrency(product_sellable?.inventory?.cost || 0)}>
          {formatCurrency(product_sellable?.inventory?.cost || 0)}
        </Tooltip>
      ),
    },
    {
      title: "Stock Status",
      dataIndex: "stock_status",
      key: "stock_status",
      render: (_, { product_sellable }) => {
        const stockStatus =
          product_sellable?.inventory?.stock_status === StockStatus.LOW_STOCK
            ? "text-yellow-500"
            : product_sellable?.inventory?.stock_status ===
                StockStatus.OUT_OF_STOCK
              ? "text-red-500"
              : "text-green-500";
        return (
          <Tooltip
            title={() => (
              <p className={cn("capitalize", `${stockStatus}`)}>
                {product_sellable?.inventory?.stock_status}
              </p>
            )}
          >
            <span className={cn("font-semibold", `${stockStatus}`)}>
              {formatNumber(product_sellable?.inventory?.quantity || 0)}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: "Total Inventory Value",
      key: "totalInventoryValue",
      dataIndex: "totalInventoryValue",
      render: (_, { product_sellable }) => (
        <Tooltip
          title={formatCurrency(product_sellable?.inventory?.total_value || 0)}
        >
          {formatCurrency(product_sellable?.inventory?.total_value || 0)}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => {
        return (
          <Select
            options={statusOptions}
            defaultValue={status}
            disabled={updateStatusLoading}
            // TODO: add onSelect
            // onSelect={(value) => {
            //   _onSelectStatus(value, id);
            // }}
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
        // TODO: add handleDelete
        <ActionGroup
          isWithDeleteConfirmPopover={false}
          deleteConfirmPopoverProps={{
            title: "Are you sure you want to delete this product?",
          }}
          // handleDelete={() => {
          //   _onSoftDeleteProduct(id);
          // }}
          // handleEdit={() => {
          //   _onOpenModalUpdateProduct(id);
          // }}
        />
      ),
    },
  ];

  const variantExpandedRowRender = (dataScource: VariantProductModel[]) => {
    return (
      <Table<VariantProductModel>
        tableLayout="auto"
        columns={variantColumns}
        dataSource={dataScource}
        pagination={false}
        size="small"
        rowKey={(record) => record.id}
        scroll={{ x: "100%" }}
      />
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
            tableLayout="auto"
            dataSource={inventoriesData}
            columns={columns}
            onChange={_onChangeTable}
            expandable={{
              expandedRowRender: (record) => {
                const variantData =
                  (inventoriesData &&
                    inventoriesData.flatMap((item) => item.variant || [])) ||
                  [];
                const data = variantData.filter(
                  (item) => item?.product_id === record.id,
                );
                return variantExpandedRowRender(data);
              },
            }}
            rowKey={(record) => record.id}
            rowSelection={{
              onSelect: (record, selected, selectedRows, nativeEvent) =>
                _onSelectRow(record, selected, selectedRows),
              onSelectAll: (selected, selectedRows, changeRows) =>
                _onSelectAllRow(selected, selectedRows, changeRows),
            }}
            scroll={{ x: "100%" }}
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
