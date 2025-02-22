"use client";
import Button from "@/app/shared/components/Button";
import { RichTextContainer } from "@/app/shared/components/Container";
import Form from "@/app/shared/components/Form";
import {
  useAppSelector,
  useCustomerAppDispatch,
  useCustomerAppSelector,
} from "@/app/shared/hooks/useRedux";
import {
  IAddToCartDTO,
  IAddToCartDTOWithLocal,
} from "@/app/shared/interfaces/cart/cart.dto";
import { ProductModel } from "@/app/shared/models/products/products.model";
import {
  OptionModel,
  VariantProductModel,
} from "@/app/shared/models/variant/variant.model";
import { cartServices } from "@/app/shared/services/cart/cartService";
import { addToCart } from "@/app/shared/store/main-reducers/cart/cart";
import { cn, formatCurrency } from "@/app/shared/utils/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import clsx from "clsx";
import { Car, Heart, Package, ShoppingCart, Star, Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<IAddToCartDTO>();
  const [isFavorite, setIsFavorite] = useState(false);
  const cart_id =
    useCustomerAppSelector((state) => state.auth).customerInfo?.cart_id || "";
  const dispatch = useCustomerAppDispatch();
  const _onFavorite = () => {
    setIsFavorite((prev) => !prev);
  };
  const _onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("quantity", Number(e.target.value));
  };
  const _onQuantityIncrease = () => {
    setValue("quantity", getValues("quantity") + 1);
  };
  const _onQuantityDecrease = () => {
    setValue("quantity", getValues("quantity") - 1);
  };
  const _onSelectOptionValue = (optionId: string, optionValueId: string) => {
    handleSelectOptionValue(optionId, optionValueId);
    setValue("id", variant?.product_sellable?.id || "");
  };
  const { name, product_sellable } = variant || {};
  const { price, total_discounts, price_after_discounts } =
    product_sellable || {};
  const hasDiscount = price == price_after_discounts;
  const _onBuyNow = () => {
    console.log("Buy now");
  };
  const _onAddToCart = async (data: IAddToCartDTO) => {
    const payload: IAddToCartDTOWithLocal = {
      ...data,
      cart_id: cart_id,
      img_url: product_sellable?.image?.[0]?.url || "",
      name: name || "",
      price: price || 0,
      price_after_discounts: price_after_discounts || 0,
      subtotal: data.quantity * (price || 0),
      discount_amount: data.quantity * (total_discounts || 0),
      total: data.quantity * (price_after_discounts || 0),
      product_sellable: {
        ...product_sellable,
        variant: variant,
      },
    };
    try {
      dispatch(addToCart(payload));
      reset({
        quantity: 1,
        id: variant?.product_sellable?.id || "",
        cart_id: cart_id,
      });
      toast({
        title: "Add to cart successfully",
        description: "Check your cart now!",
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (variant) {
      setValue("id", variant?.product_sellable?.id || "");
      setValue("quantity", 1);
    }
  }, [variant]);
  return (
    <div className="content__info">
      {/* Title */}
      <div className="title">
        <h2 className="hyphens-auto text-wrap break-words font-roboto-bold text-h2">
          {name}
        </h2>
      </div>
      {/* Price */}
      <div className="pricegroup mt-4">
        <div className="pricegroup__text flex items-center gap-2">
          {!hasDiscount && (
            <p className="pricegroup__text-price h-full text-body-text line-through">
              {formatCurrency(price || 0)}
            </p>
          )}
          <p className="pricegroup__text-price h-full font-roboto-medium text-body-big">
            {formatCurrency(price_after_discounts || 0)}
          </p>
        </div>
      </div>
      {/* Reviews */}
      <div className="mt-4 flex items-center gap-4">
        {/* Love */}
        <Button variant="vanilla" onClick={_onFavorite}>
          <Heart
            className={cn(
              "h-8 w-8 transition-all duration-300",
              isFavorite && "color-pink-200 fill-pink-200",
            )}
          />
        </Button>
        {/* Stars */}
        <div className="pricegroup__starsgroup flex items-end gap-2">
          <div className="pricegroup__starsgroup-list starslist flex items-center gap-[4px]">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <Star className="h-8 w-8" key={index} />
              ))}
          </div>
          <div className="pricegroup__starsgroup-reviews">
            <span className="score mr-[4px]">{0 || 0}</span>
            <span className="reviews text-body-sub">({0 || 0} reviews)</span>
          </div>
        </div>
      </div>
      <div className="my-8 h-[1px] w-full bg-gray-100"></div>
      {/* Description */}
      {productInfo?.short_description && (
        <RichTextContainer
          classes="short-description max-h-[300px] max-w-fit overflow-y-auto text-wrap break-words"
          dangerouslySetInnerHTML={{
            __html: productInfo?.short_description as string,
          }}
        ></RichTextContainer>
      )}
      <div className="options">
        {options &&
          options?.map((option, index) => {
            const { option_values } = option || {};
            return (
              <div className="option mt-8" key={option.id}>
                <h3 className="font-roboto-medium text-body-big">
                  {option?.name}
                </h3>
                <div className="mt-2">
                  <RadioGroup
                    value={selectedOptionValueId[option?.id || ""] || ""}
                    onValueChange={(value) =>
                      _onSelectOptionValue(option?.id || "", value)
                    }
                  >
                    {option_values?.map((value) => {
                      return (
                        <div
                          className="flex items-center space-x-2"
                          key={value.id}
                        >
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
                                className={cn("h-8 w-8 rounded-full")}
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
      <div className="actionsgroup mt-8">
        <div className="actionsgroup__quantity flex items-center gap-gutter">
          <div className="flex w-full max-w-[140px] flex-1 flex-shrink-0 items-center rounded-full bg-white px-2">
            <Button
              variant="icon"
              onClick={_onQuantityDecrease}
              classes="hover:bg-green-300 hover:text-white duration-300 "
            >
              -
            </Button>
            <Form.Input
              type="number"
              value={watch("quantity")}
              {...register("quantity")}
              onChange={_onQuantityChange}
            />
            <Button
              variant="icon"
              onClick={_onQuantityIncrease}
              classes="hover:bg-green-300 hover:text-white duration-300"
            >
              +
            </Button>
          </div>
          <Button
            variant="primary"
            classes="btn-addcart h-full flex-1"
            onClick={handleSubmit(_onAddToCart)}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
        <Button
          variant="accent-1"
          classes="actionsgroup__buynow btn btn-buynow w-full mt-4"
          onClick={() => _onBuyNow()}
        >
          Buy Now
        </Button>
      </div>
      <div className="shipping mt-8">
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
  );
};

export default Info;
