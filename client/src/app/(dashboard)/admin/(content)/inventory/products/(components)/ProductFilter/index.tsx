import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import Filter from "@/app/shared/components/Filter";
import FilterComponent from "@/app/shared/components/Filter";
import { CategoryModel } from "@/app/shared/models/categories/categories.model";
import { OptionModel } from "@/app/shared/models/variant/variant.model";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useQuery } from "@tanstack/react-query";
import {
  Checkbox,
  ColorPicker,
  Divider,
  Input,
  Select,
  Tag,
  TreeProps,
  TreeSelect,
} from "antd";
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
};

const ProductFilter = ({  
  categories,
  options,
  search,
  selectedCategories,
  selectedOptions,
  handleSearch,
  handleSelectCategory,
  handleSelectOption,
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
  const _onSelectOption = (value: string[]) => {
    handleSelectOption(value);
  }
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
      <Filter.Item name="brand">Nhãn hàng</Filter.Item>
      <Filter.Item name="status">Trạng thái sản phẩm</Filter.Item>
      <Filter.Item name="discount">Trạng thái giảm giá</Filter.Item>
      <Filter.Item name="limit">Số bản ghi</Filter.Item>
    </FilterComponent>
  );
};

export default ProductFilter;
