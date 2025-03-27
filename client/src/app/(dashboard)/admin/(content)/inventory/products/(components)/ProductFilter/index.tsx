import { useProducts } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProduct";
import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import { LIMIT_OPTIONS, STATUS_OPTIONS } from "@/app/constants/seeds";
import CustomCheckboxGroup from "@/app/shared/components/CustomCheckbox";
import Filter from "@/app/shared/components/Filter";
import FilterComponent from "@/app/shared/components/Filter";
import { BrandModel } from "@/app/shared/models/brands/brands.model";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { OptionModel } from "@/app/shared/models/variant/variant.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  ColorPicker,
  Divider,
  Input,
  Select,
  Tag,
  TreeProps,
  TreeSelect,
} from "antd";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useIntl } from "react-intl";

type Props = {
  selectedCategories: string[];
  handleSelectCategory: (value: string[]) => void;
  categories: CategoryModel[];
  options: OptionModel[] | undefined;
  search: string;
  handleSearch: (value: string) => void;
  handleSelectOption: (value: string[]) => void;
  selectedOptions: string[];
  brands: BrandModel[] | undefined;
  handleSelectBrand: (value: string[]) => void;
  selectedBrands: string[];
  selectedStatuses: ModelStatus[];
  handleSelectStatus: (value: ModelStatus[]) => void;
  discounts: DiscountModel[] | undefined;
  selectedDiscounts: string[];
  handleSelectDiscount: (value: string[]) => void;
  handleLoadMoreDiscount: () => void;
  hasNextDiscountPage: boolean;
  handleSearchDiscount: (value: string) => void;
  handleClearAll: () => void;
  hasSelectedItems: boolean;
  limit: number;
  handleSelectLimit: (value: number) => void;
  handleApplyFilters: () => void;
  isApplyFilters: boolean;
};

const ProductFilter = ({
  categories,
  options,
  brands,
  hasSelectedItems,
  discounts,
  selectedCategories,
  selectedOptions,
  selectedBrands,
  selectedStatuses,
  selectedDiscounts,
  hasNextDiscountPage,
  limit,
  handleSearch,
  handleSelectCategory,
  handleSelectOption,
  handleSelectBrand,
  handleSelectStatus,
  handleSelectDiscount,
  handleLoadMoreDiscount,
  handleSearchDiscount,
  handleClearAll,
  handleSelectLimit,
  handleApplyFilters,
  isApplyFilters,
}: Props) => {
  const intl = useIntl();
  const _onSearch = (value: string) => {
    handleSearch(value);
  };
  const _onSelectCategory = (value: string[]) => {
    handleSelectCategory(value);
  };
  const _onSelectBrand = (value: string[]) => {
    handleSelectBrand(value);
  };
  const _onSelectOption = (value: string[]) => {
    handleSelectOption(value);
  };
  const _onSelectStatus = (value: ModelStatus[]) => {
    handleSelectStatus(value);
  };
  const _onSelectDiscount = (value: string[]) => {
    handleSelectDiscount(value);
  };
  const _onLoadMoreDiscount = () => {
    handleLoadMoreDiscount();
  };
  const _onSearchDiscount = (value: string) => {
    handleSearchDiscount(value);
  };
  const _onSelectLimit = (value: number) => {
    handleSelectLimit(value);
  };
  const optionTree: TreeProps["treeData"] = useMemo(() => {
    return options?.map((item) => {
      return {
        key: item.id,
        title: item.name,
        value: item.id,
        children: item?.option_values?.map((optionVal) => {
          return {
            key: optionVal.id,
            value: optionVal.id,
            title: (
              <div className="flex items-center gap-2">
                {item.is_color ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex-shrink-0"
                      style={{
                        background: optionVal.value,
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                      }}
                    ></div>
                    <p>{optionVal.name}</p>
                  </div>
                ) : (
                  <p>{optionVal.name}</p>
                )}
              </div>
            ),
          };
        }),
      };
    });
  }, [options]);
  return (
    <FilterComponent
      hasSelectedItems={hasSelectedItems}
      clearAll={handleClearAll}
      applyFilters={handleApplyFilters}
    >
      <Filter.Item name="search" label={intl.formatMessage({ id: "search" })}>
        <Input.Search
          onSearch={(value) => {
            _onSearch(value);
          }}
          placeholder={intl.formatMessage({ id: "search" })}
        />
      </Filter.Item>
      <Filter.Item
        name="category"
        label={intl.formatMessage({ id: "categories" })}
      >
        <CustomCheckboxGroup
          data={categories?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          selectedData={selectedCategories}
          onSelect={_onSelectCategory}
        />
      </Filter.Item>
      <Filter.Item
        name="options"
        label={intl.formatMessage({ id: "attributes" })}
      >
        <TreeSelect
          className="w-full"
          treeData={optionTree}
          treeCheckable={true}
          showCheckedStrategy={"SHOW_CHILD"}
          multiple={true}
          allowClear={true}
          value={selectedOptions}
          onChange={_onSelectOption}
          placeholder={intl.formatMessage({ id: "select_attributes" })}
        />
      </Filter.Item>
      <Filter.Item name="brand" label={intl.formatMessage({ id: "brands" })}>
        <CustomCheckboxGroup
          data={brands?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          selectedData={selectedBrands}
          onSelect={_onSelectBrand}
        />
      </Filter.Item>
      <Filter.Item name="status" label={intl.formatMessage({ id: "status" })}>
        <CustomCheckboxGroup
          data={STATUS_OPTIONS.map((item) => ({
            label: intl.formatMessage({ id: `sell_${item.label}` }),
            value: item.value,
          }))}
          selectedData={selectedStatuses}
          onSelect={(value) => {
            _onSelectStatus(value as ModelStatus[]);
          }}
        />
      </Filter.Item>
      <Filter.Item
        name="discount"
        label={intl.formatMessage({ id: "discount" })}
      >
        <Select
          placeholder={intl.formatMessage({ id: "select_discount" })}
          className="w-full"
          mode="multiple"
          showSearch={false}
          options={discounts?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedDiscounts}
          onChange={_onSelectDiscount}
          dropdownRender={(menu) => {
            return (
              <div>
                <div className="flex w-full items-center justify-center gap-2">
                  <Input.Search
                    placeholder={intl.formatMessage({ id: "search" })}
                    onSearch={_onSearchDiscount}
                  />
                </div>
                {menu}
                <Button
                  className="w-full"
                  disabled={!hasNextDiscountPage}
                  onClick={_onLoadMoreDiscount}
                >
                  {intl.formatMessage({ id: "load_more" })}
                </Button>
              </div>
            );
          }}
        />
      </Filter.Item>
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
    </FilterComponent>
  );
};

export default ProductFilter;
