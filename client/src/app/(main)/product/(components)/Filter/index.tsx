"use client";

import Button from "@/app/shared/components/Button";
import Dropdown from "@/app/shared/components/Dropdown";
import Select from "@/app/shared/components/Select";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";

type Props = {};

const Filter = (props: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>(
    {},
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const handleGetSelectedOptions = (id: string, data: any) => {
    if (selectedOptions[id]) {
      setSelectedOptions((prev) => ({ ...prev, [id]: null }));
    } else {
      setSelectedOptions((prev) => ({ ...prev, [id]: data }));
    }
    console.log(selectedOptions);
  };
  const handleGetSelectedPriceRange = (id: string) => {
    console.log(id);
    setSelectedPriceRange(id);
  };
  return (
    <div className="product-page__filter flex w-full max-w-[286px] flex-col gap-gutter">
      <Filter.Item title="Category" classes="product-page__filter-item w-full ">
        <div className="dropdown flex w-full flex-col gap-[16px]">
          <Dropdown
            title={
              <div className="dropdown__title-text">
                Candle
                <span className="ml-[6px] font-roboto-regular">(2)</span>
              </div>
            }
            classes="dropdown__list flex flex-col gap-[4px]"
          >
            <Dropdown.Item>
              <Select.Option
                id="beeswax-candles"
                isChecked={
                  selectedOptions["beeswax-candles"] === "Beeswax Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Beeswax Candles")
                }
              >
                Beeswax Candles
              </Select.Option>
            </Dropdown.Item>
            <Dropdown.Item>
              <Select.Option
                id="pillar-candles"
                isChecked={
                  selectedOptions["pillar-candles"] === "Pillar Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Pillar Candles")
                }
              >
                Pillar Candles
              </Select.Option>
            </Dropdown.Item>
            <Dropdown.Item>
              <Select.Option
                id="votive-candles"
                isChecked={
                  selectedOptions["votive-candles"] === "Votive Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Votive Candles")
                }
              >
                Votive Candles
              </Select.Option>
            </Dropdown.Item>
          </Dropdown>
          <Dropdown
            title={
              <div className="dropdown__title-text">
                Candle
                <span className="ml-[6px] font-roboto-regular">(2)</span>
              </div>
            }
            classes="dropdown__list flex flex-col gap-[4px]"
          >
            <Dropdown.Item>
              <Select.Option
                id="beeswax-candles"
                isChecked={
                  selectedOptions["beeswax-candles"] === "Beeswax Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Beeswax Candles")
                }
              >
                Beeswax Candles
              </Select.Option>
            </Dropdown.Item>
            <Dropdown.Item>
              <Select.Option
                id="pillar-candles"
                isChecked={
                  selectedOptions["pillar-candles"] === "Pillar Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Pillar Candles")
                }
              >
                Pillar Candles
              </Select.Option>
            </Dropdown.Item>
            <Dropdown.Item>
              <Select.Option
                id="votive-candles"
                isChecked={
                  selectedOptions["votive-candles"] === "Votive Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Votive Candles")
                }
              >
                Votive Candles
              </Select.Option>
            </Dropdown.Item>
          </Dropdown>
          <Dropdown
            title={
              <div className="dropdown__title-text">
                Candle
                <span className="ml-[6px] font-roboto-regular">(2)</span>
              </div>
            }
            classes="dropdown__list flex flex-col gap-[4px]"
          >
            <Dropdown.Item>
              <Select.Option
                id="beeswax-candles"
                isChecked={
                  selectedOptions["beeswax-candles"] === "Beeswax Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Beeswax Candles")
                }
              >
                Beeswax Candles
              </Select.Option>
            </Dropdown.Item>
            <Dropdown.Item>
              <Select.Option
                id="pillar-candles"
                isChecked={
                  selectedOptions["pillar-candles"] === "Pillar Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Pillar Candles")
                }
              >
                Pillar Candles
              </Select.Option>
            </Dropdown.Item>
            <Dropdown.Item>
              <Select.Option
                id="votive-candles"
                isChecked={
                  selectedOptions["votive-candles"] === "Votive Candles"
                }
                onChange={(id) =>
                  handleGetSelectedOptions(id, "Votive Candles")
                }
              >
                Votive Candles
              </Select.Option>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Filter.Item>
      <Filter.Item title="Price Range" classes="product-page__filter-item">
        <div className="dropdown flex w-full flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <Select.Option
              id="price-range-1"
              isChecked={selectedPriceRange === "price-range-1"}
              onChange={(id) => handleGetSelectedPriceRange(id)}
            >
              $20 - $40
            </Select.Option>
            <Select.Option
              id="price-range-2"
              isChecked={selectedPriceRange === "price-range-2"}
              onChange={(id) => handleGetSelectedPriceRange(id)}
            >
              $40 - $60
            </Select.Option>
            <Select.Option
              id="price-range-3"
              isChecked={selectedPriceRange === "price-range-3"}
              onChange={(id) => handleGetSelectedPriceRange(id)}
            >
              $60 - $80
            </Select.Option>
            <Select.Option
              id="price-range-4"
              isChecked={selectedPriceRange === "price-range-4"}
              onChange={(id) => handleGetSelectedPriceRange(id)}
            >
              $80 - $100
            </Select.Option>
          </div>
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
