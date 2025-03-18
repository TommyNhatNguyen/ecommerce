import React from "react";
import Filter from "@/app/shared/components/Filter";
import FilterComponent from "@/app/shared/components/Filter";
import { Button, Input, Select } from "antd";
import { useIntl } from "react-intl";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import {
  STOCK_STATUS,
  STOCK_STATUS_OPTION,
} from "@/app/constants/stock-status";
import { BrandModel } from "@/app/shared/models/brands/brands.model";
import { FilterIcon } from "lucide-react";
import { LIMIT_OPTIONS } from "@/app/constants/seeds";
type Props = {
  handleClearAll: () => void;
  hasSelectedItems: boolean;
  limit: number;
  handleSelectLimit: (value: number) => void;
  handleSearch: (value: string) => void;
  warehouses: WarehouseModel[] | undefined;
  selectedWarehouses: string[];
  handleSelectWarehouse: (value: string[]) => void;
  categories: CategoryModel[] | undefined;
  selectedCategories: string[];
  handleSelectCategory: (value: string[]) => void;
  selectedStockStatuses: string[];
  handleSelectStockStatus: (value: string[]) => void;
  brands: BrandModel[] | undefined;
  selectedBrands: string[];
  handleSelectBrand: (value: string[]) => void;
};

const InventoryFilter = ({
  warehouses,
  selectedWarehouses,
  categories,
  selectedCategories,
  brands,
  selectedBrands,
  limit,
  hasSelectedItems,
  selectedStockStatuses,
  handleClearAll,
  handleSelectLimit,
  handleSearch,
  handleSelectWarehouse,
  handleSelectCategory,
  handleSelectStockStatus,
  handleSelectBrand,
}: Props) => {
  const intl = useIntl();
  const _onSearch = (value: string) => {
    handleSearch(value);
  };
  const _onSelectWarehouse = (value: string[]) => {
    handleSelectWarehouse(value);
  };
  const _onSelectCategory = (value: string[]) => {
    handleSelectCategory(value);
  };
  const _onSelectStockStatus = (value: string[]) => {
    handleSelectStockStatus(value);
  };
  const _onSelectBrand = (value: string[]) => {
    handleSelectBrand(value);
  };
  const _onSelectLimit = (value: number) => {
    handleSelectLimit(value);
  };
  const _onAdvancedFilter = () => {
    console.log("advanced filter");
  };
  return (
    <FilterComponent
      hasSelectedItems={hasSelectedItems}
      clearAll={handleClearAll}
    >
      {/* Tên sản phẩm (search) */}
      <Filter.Item name="search" label={intl.formatMessage({ id: "search" })}>
        <Input.Search
          onSearch={_onSearch}
          placeholder={intl.formatMessage({ id: "search" })}
        />
      </Filter.Item>
      {/* Theo kho hàng (select multiple) */}
      <Filter.Item
        name="warehouse"
        label={intl.formatMessage({ id: "warehouse" })}
      >
        <Select
          placeholder={intl.formatMessage({ id: "select_warehouse" })}
          className="w-full"
          mode="multiple"
          showSearch={false}
          options={warehouses?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedWarehouses}
          onChange={_onSelectWarehouse}
        />
      </Filter.Item>
      {/* Theo nhóm sản phẩm (select multiple) */}
      <Filter.Item
        name="category"
        label={intl.formatMessage({ id: "category" })}
      >
        <Select
          placeholder={intl.formatMessage({ id: "select_category" })}
          className="w-full"
          mode="multiple"
          showSearch={false}
          options={categories?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedCategories}
          onChange={_onSelectCategory}
        />
      </Filter.Item>
      {/* Theo trạng thái kho (select multiple) */}
      <Filter.Item
        name="stock_status"
        label={intl.formatMessage({ id: "stock_status" })}
      >
        <Select
          placeholder={intl.formatMessage({ id: "select_stock_status" })}
          className="w-full"
          mode="multiple"
          showSearch={false}
          options={STOCK_STATUS_OPTION.map((item) => ({
            label: intl.formatMessage({ id: item.id }),
            value: item.value,
          }))}
          value={selectedStockStatuses}
          onChange={_onSelectStockStatus}
        />
      </Filter.Item>
      {/* Theo thương hiệu (select multiple) */}
      <Filter.Item name="brand" label={intl.formatMessage({ id: "brands" })}>
        <Select
          placeholder={intl.formatMessage({ id: "select_brands" })}
          className="w-full"
          mode="multiple"
          showSearch={false}
          options={brands?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedBrands}
          onChange={_onSelectBrand}
        />
      </Filter.Item>
      {/* Số lượng bản ghi (select) */}
      <Filter.Item name="limit" label={intl.formatMessage({ id: "limit" })}>
        <Select
          className="w-full"
          options={LIMIT_OPTIONS.map((item) => ({
            label: `${item.label} ${intl.formatMessage({ id: "products" })}`,
            value: item.value,
          }))}
          value={limit}
          onChange={_onSelectLimit}
        />
      </Filter.Item>
      {/* Lọc nâng cao */}
      <Button
        type="primary"
        icon={<FilterIcon width={16} height={16} />}
        onClick={_onAdvancedFilter}
        className="w-full"
      >
        {intl.formatMessage({ id: "advanced_filter" })}
      </Button>
    </FilterComponent>
  );
};

export default InventoryFilter;

/**
 * 
 * Tên sản phẩm (search)
 * Theo kho hàng (select multiple)
 * Theo trạng thái kho (select multiple)
 * Theo nhóm sản phẩm (select multiple)
 * Theo thương hiệu (select multiple)
 * Range: giá, giá vốn trung bình, tổng số lượng tồn kho,
      tổng giá vốn (lọc nâng cao - popup bao gồm những cái trên)
 */
