import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import Filter from "@/app/shared/components/Filter";
import FilterComponent from "@/app/shared/components/Filter";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useQuery } from "@tanstack/react-query";
import { Checkbox, Divider, Input, Select } from "antd";
import React, { useState } from "react";
import { useIntl } from "react-intl";

type Props = {
  selectedCategories: string[];
  handleSelectCategory: (value: string[]) => void;
  categories: CategoryModel[];
  search: string;
  handleSearch: (value: string) => void;
};

const ProductFilter = ({
  selectedCategories,
  handleSelectCategory,
  categories,
  search,
  handleSearch,
}: Props) => {
  const intl = useIntl();
  const _onSearch = (value: string) => {
    handleSearch(value);
  };
  const _onSelectCategory = (value: string[]) => {
    handleSelectCategory(value);
  };
  const _onSelectAllCategory = () => {
    if (checkAll) {
      handleSelectCategory([]);
    } else {
      handleSelectCategory(categories?.map((item) => item.id) || []);
    }
  };
  const indeterminate =
    selectedCategories.length > 0 &&
    selectedCategories.length < categories.length;
  const checkAll = selectedCategories.length === categories.length;
  return (
    <FilterComponent>
      <Filter.Item name="search" label={intl.formatMessage({ id: "search" })}>
        <Input.Search
          value={search}
          onChange={(e) => {
            _onSearch(e.target.value);
          }}
          placeholder={intl.formatMessage({ id: "search" })}
        />
      </Filter.Item>
      <Filter.Item
        name="category"
        label={intl.formatMessage({ id: "categories" })}
      >
        <Checkbox
          indeterminate={indeterminate}
          onChange={_onSelectAllCategory}
          checked={checkAll}
        >
          {intl.formatMessage({ id: "check_all" })}
        </Checkbox>
        <Checkbox.Group
          options={categories?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          value={selectedCategories}
          onChange={_onSelectCategory}
        />
      </Filter.Item>
      <Filter.Item name="options">Thuộc tính</Filter.Item>
      <Filter.Item name="brand">Nhãn hàng</Filter.Item>
      <Filter.Item name="status">Trạng thái sản phẩm</Filter.Item>
      <Filter.Item name="discount">Trạng thái giảm giá</Filter.Item>
      <Filter.Item name="limit">Số bản ghi</Filter.Item>
    </FilterComponent>
  );
};

export default ProductFilter;
