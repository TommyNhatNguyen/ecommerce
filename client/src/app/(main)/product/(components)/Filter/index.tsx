"use client";

import Button from "@/app/shared/components/Button";
import Dropdown from "@/app/shared/components/Dropdown";
import Select from "@/app/shared/components/Select";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

type FilterPropsType = {
  selectedOptions: Record<string, any>;
  handleGetSelectedOptions: (data: any) => void;
};

const Filter = ({
  handleGetSelectedOptions,
  selectedOptions,
}: FilterPropsType) => {
  const _onChangeSelectOption = (id: string) => {
    handleGetSelectedOptions(id);
  };
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      categoriesService.getCategories({
        include_all: true,
      }),
  });
  return (
    <div className="product-page__filter flex w-full max-w-[286px] flex-col gap-gutter">
      <Filter.Item title="Category" classes="product-page__filter-item w-full ">
        <div className="dropdown flex w-full flex-col gap-[16px]">
          {categories?.data &&
            categories?.data?.map((category) => {
              const { id, name } = category;
              return (
                <div
                  key={id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    className="h-[16px] w-[16px] overflow-hidden rounded-md"
                    id={id}
                    checked={selectedOptions.includes(id)}
                    onCheckedChange={(checked) => _onChangeSelectOption(id)}
                  />
                  <label htmlFor={id}>{name}</label>
                </div>
              );
            })}
        </div>
      </Filter.Item>
    </div>
  );
};

type FilterItemPropsType = {
  title: string;
  classes?: string;
  children: React.ReactNode;
};

Filter.Item = ({ title, classes, children }: FilterItemPropsType) => {
  return (
    <div
      className={clsx(
        "filter-item aspect-[286/366] min-w-[286px] max-w-fit overflow-y-auto rounded-[16px] bg-bg-secondary px-[30px] py-[40px]",
        classes,
      )}
    >
      <div className="filter-item__title relative flex items-center">
        <div className="absolute h-5/6 w-[3px] bg-green-300"></div>
        <h3 className="ml-[16px] font-playright-semibold text-h3">{title}</h3>
      </div>
      <div className="filter-item__group mt-[16px]">{children}</div>
    </div>
  );
};
export default Filter;
