"use client";
import Button from "@/app/shared/components/Button";
import Form from "@/app/shared/components/Form";
import { ProductModel } from "@/app/shared/models/products/products.model";
import {
  OptionModel,
  VariantProductModel,
} from "@/app/shared/models/variant/variant.model";
import { cn, formatCurrency } from "@/app/shared/utils/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import clsx from "clsx";
import { Car, Heart, Package, ShoppingCart, Star, Truck } from "lucide-react";
import React, { useState } from "react";

type Props = {
  options: OptionModel[];
  handleSelectOptionValue: (optionId: string, optionValueId: string) => void;
  selectedOptionValueId: {
    [key: string]: string;
  };
  variant?: VariantProductModel;
  productInfo?: ProductModel;
};

const Info = ({
  options,
  handleSelectOptionValue,
  selectedOptionValueId,
  variant,
  productInfo,
}: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const _onFavorite = () => {
    setIsFavorite((prev) => !prev);
  };
  const _onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };
  const _onQuantityIncrease = () => {
    setQuantity((prev) => prev + 1);
  };
  const _onQuantityDecrease = () => {
    setQuantity((prev) => prev - 1);
  };
  const _onSelectOptionValue = (optionId: string, optionValueId: string) => {
    handleSelectOptionValue(optionId, optionValueId);
  };
  const { name, product_sellable } = variant || {};
  const { price, total_discounts, price_after_discounts } =
    product_sellable || {};
  return (
    <div className="content__info">
      <div className="content__info-group">
        <div className="title flex items-center justify-between gap-gutter">
          <h2 className="font-roboto-bold text-h2">{name}</h2>
          <Button
            variant="vanilla"
            classes="btn btn-heart"
            onClick={_onFavorite}
          >
            <Heart
              className={clsx(
                "h-16 w-16 transition-all duration-300",
                isFavorite && "color-pink-200 fill-pink-200",
              )}
            />
          </Button>
        </div>
        <div className="pricegroup mt-[20px] flex items-center gap-[20px]">
          <div className="pricegroup__text relative w-fit">
            <p className="pricegroup__text-price h-full font-roboto-medium text-body-big">
              {formatCurrency(price || 0)}
            </p>
            <p className="pricegroup__text-price h-full font-roboto-medium text-body-big">
              {formatCurrency(price_after_discounts || 0)}
            </p>
            <div className="absolute bottom-0 right-[-10px] top-0 h-full w-[1px] bg-green-300"></div>
          </div>
          <div className="pricegroup__starsgroup flex items-center gap-[10px]">
            <div className="pricegroup__starsgroup-list starslist flex items-center gap-[4px]">
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </div>
            <div className="pricegroup__starsgroup-reviews">
              {/* <span className="score mr-[4px]">{rating}</span>
              <span className="reviews text-body-sub">({reviews} reviews)</span> */}
            </div>
          </div>
        </div>
        <div className="my-[30px] h-[1px] w-full bg-gray-100"></div>
        <div className="description">{productInfo?.description || ""}</div>
        <div className="options">
          {options &&
            options?.map((option, index) => {
              const { option_values } = option || {};
              return (
                <div className="option mt-[20px]">
                  <h3>{option?.name}</h3>
                  <div className="mt-[10px]">
                    <RadioGroup
                      value={selectedOptionValueId[option?.id || ""] || ""}
                      onValueChange={(value) =>
                        _onSelectOptionValue(option?.id || "", value)
                      }
                    >
                      {option_values?.map((value) => {
                        return (
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={value?.id || ""}
                              id={value?.id || ""}
                            />
                            <label
                              htmlFor={value?.id || ""}
                              className="flex items-center gap-2"
                            >
                              {option?.is_color && (
                                <div
                                  style={{
                                    backgroundColor: value?.value,
                                  }}
                                  className={cn(
                                    "h-[20px] w-[20px] rounded-full",
                                  )}
                                ></div>
                              )}
                              {value?.name}
                            </label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="actionsgroup mt-[30px]">
          <div className="actionsgroup__quantity flex items-center gap-gutter">
            <div className="flex w-full max-w-fit flex-shrink-0 items-center rounded-full bg-white">
              <Button
                variant="vanilla"
                onClick={_onQuantityDecrease}
                classes="hover:bg-green-300 hover:text-white duration-300"
              >
                -
              </Button>
              <Form.Input
                type="number"
                value={quantity}
                inputClasses="text-center w-[50px]"
                wrapperClasses="border-none"
                onChange={_onQuantityChange}
              />
              <Button
                variant="vanilla"
                onClick={_onQuantityIncrease}
                classes="hover:bg-green-300 hover:text-white duration-300"
              >
                +
              </Button>
            </div>
            <Button
              variant="primary"
              classes="btn-addcart flex-1 font-roboto-medium"
            >
              <ShoppingCart />
              Add to Cart
            </Button>
          </div>
          <Button
            variant="accent-1"
            classes="actionsgroup__buynow btn btn-buynow font-roboto-medium w-full mt-[30px]"
          >
            Buy Now
          </Button>
        </div>
        <div className="shipping mt-[32px]">
          <div className="shipping__item flex items-center gap-[8px]">
            <Truck />
            <span>Free Shipping on orders over $50</span>
          </div>
          <div className="shipping__item mt-[12px] flex items-center gap-[8px]">
            <Package />
            <span>Delivers in: 3-7 Working Days Shipping & Return</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
