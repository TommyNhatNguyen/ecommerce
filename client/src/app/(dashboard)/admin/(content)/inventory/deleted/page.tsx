"use client";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { useInventory } from "@/app/(dashboard)/admin/(content)/inventory/hooks/useInventory";
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
import { STATUS_OPTIONS } from "@/app/constants/seeds";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { PlusIcon, TrashIcon } from "lucide-react";
import withDeleteConfirmPopover from "@/app/shared/components/Popover";
import { useInventoryDelete } from "@/app/(dashboard)/admin/(content)/inventory/hooks/useInventoryDelete";
import { STOCK_STATUS } from "@/app/constants/stock-status";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { DISCOUNT_TYPE } from "@/app/constants/enum";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { ButtonDeleteWithPopover } from "@/app/shared/components/Button";

type DeletedProductPagePropsType = {};
type OnChange = NonNullable<TableProps<ProductModel>["onChange"]>;
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
    handleDeleteVariant,
    deleteVariantLoading,
    handleUpdateVariantStatus,
    updateVariantStatusLoading,
    selectedRows,
    updateStatusLoading,
    deleteProductLoading,
    deleteSelectedProductsLoading,
  } = useInventoryDelete();
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryLimit, setInventoryLimit] = useState(10);
  const {
    data: inventories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "inventories",
      inventoryPage,
      inventoryLimit,
      updateStatusLoading,
      deleteProductLoading,
      deleteSelectedProductsLoading,
      deleteVariantLoading,
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
        status: "DELETED",
      }),
    placeholderData: keepPreviousData,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
  });
  const { data: inventoriesData, meta } = inventories || {};
  const { limit, total_count, current_page } = meta || {};
  const _onSelectStatus = async (status: ModelStatus, id: string) => {
    await handleUpdateStatus(id, status);
  };
  const _onDeleteProduct = async (id: string) => {
    await handleDeleteProduct(id);
  };
  const _onDeleteSelectedProducts = async () => {
    await handleDeleteSelectedProducts();
  };
  const _onDeleteVariant = async (id: string) => {
    await handleDeleteVariant(id);
  };
  const _onSelectVariantStatus = async (status: ModelStatus, id: string) => {
    await handleUpdateVariantStatus(id, status);
  };
  const _onDeleteSelectedVariants = async (id: string) => {
    await handleDeleteVariant(id);
  };
  const _onChangeTable: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
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
      filters: STATUS_OPTIONS.map((option) => ({
        text: option.label,
        value: option.value,
      })),
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      render: (_, { status, id }) => {
        return (
          <Select
            options={STATUS_OPTIONS}
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
                {item.options?.name} - {item.name}
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
      render: (_, { status, id }) => {
        return (
          <Select
            options={STATUS_OPTIONS}
            defaultValue={status}
            disabled={updateVariantStatusLoading}
            onSelect={(value) => {
              _onSelectVariantStatus(value, id);
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
            _onDeleteVariant(id);
          }}
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
            isWithDeleteConfirmPopover={false}
          />
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
  );
};

export default DeletedProductPage;
