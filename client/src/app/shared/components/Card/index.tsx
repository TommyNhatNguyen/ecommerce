"use client";
import { ROUTES } from "@/app/constants/routes";
import Button from "@/app/shared/components/Button";
import {
  useCustomerAppDispatch,
  useCustomerAppSelector,
} from "@/app/shared/hooks/useRedux";
import {
  IAddToCartDTO,
  IAddToCartDTOWithLocal,
} from "@/app/shared/interfaces/cart/cart.dto";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { addToCart } from "@/app/shared/store/main-reducers/cart/cart";
import {
  cn,
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { ShoppingCart, Smile } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Card = ({
  children,
  classes,
}: {
  children: React.ReactNode;
  classes?: string;
}) => {
  return <div className={cn("card", classes)}>{children}</div>;
};

type CardProps = {
  children?: React.ReactNode;
  classes?: string;
  renderAction?: () => React.ReactNode;
} & ProductModel;

export const CardProduct = ({
  children,
  classes,
  renderAction,
  ...product
}: CardProps) => {
  const { name, id, variant } = product;
  const link = `${ROUTES.PRODUCTS}/${id}`;
  const showVariant = variant?.length && variant[0]?.product_sellable;
  const {
    price,
    total_discounts,
    price_after_discounts,
    image,
    id: productSellableId,
    inventory,
  } = showVariant || {};
  const imgUrl = image?.[0]?.url || "";
  const imgUrlHover = image?.[1]?.url || "";
  const percentageDiscount =
    (total_discounts && price && (total_discounts / price) * 100) || 0;
  const dispatch = useCustomerAppDispatch();
  const cartId = useCustomerAppSelector((state) => state.cart).cartInfo?.id;
  const _onAddToCart = (productId: string | undefined) => {
    const payload: IAddToCartDTOWithLocal = {
      id: productId || "",
      quantity: 1,
      cart_id: cartId || "",
      img_url: imgUrl,
      name: name || "",
      price: price || 0,
      price_after_discounts: price_after_discounts || 0,
      subtotal: 1 * (price || 0),
      discount_amount: 1 * (total_discounts || 0),
      total: 1 * (price_after_discounts || 0),
      product_sellable: {
        ...showVariant,
        variant: {
          ...variant?.[0],
          product_id: id,
        },
      },
    };
    dispatch(addToCart(payload));
  };
  return (
    <div
      className={cn(
        "card product-card aspect-[360/630] h-full max-h-[360px] w-full rounded-[14px] bg-white/60 p-6 shadow-sm",
        "flex flex-col justify-between",
        classes,
      )}
    >
      <div className="product-card__img-wrapper group relative h-full w-full overflow-hidden rounded-[14px]">
        <Link
          href={link}
          className="product-card__img group flex h-[80%] h-full w-full flex-1 items-center justify-center overflow-hidden rounded-[14px] bg-white"
        >
          <img
            src={imgUrl}
            alt={name}
            width={286}
            height={360}
            className="absolute left-0 top-0 h-full w-full overflow-hidden object-contain object-center opacity-100 duration-300 group-hover:scale-110 group-hover:opacity-0"
          />
          <img
            src={imgUrlHover}
            alt={name}
            width={286}
            height={360}
            className="absolute left-0 top-0 h-full w-full object-contain object-center opacity-0 duration-300 group-hover:scale-110 group-hover:opacity-100"
          />
          {percentageDiscount !== 0 && (
            <div className="discount absolute left-[12px] top-[12px] content-center rounded-[10px] bg-pink-200 px-[12px] py-[6px] text-center text-body-sub text-white">
              <span className="discount__text">
                {formatDiscountPercentage(percentageDiscount)}
              </span>
            </div>
          )}
          {/* Action add to cart */}
        </Link>
        <Button
          variant="primary"
          isDisabled={inventory?.stock_status == StockStatus.OUT_OF_STOCK}
          classes="w-full min-h-[32px] p-2 rounded-[0px] absolute duration-300 bottom-[-100px] group-hover:bottom-0 left-0"
          onClick={() => _onAddToCart(productSellableId)}
        >
          {inventory?.stock_status == StockStatus.IN_STOCK ? (
            <>
              <ShoppingCart />
              <span className="ml-[8px] text-nowrap">Add to Cart</span>
            </>
          ) : inventory?.stock_status === StockStatus.OUT_OF_STOCK ? (
            <div className="flex items-center gap-[8px]">
              <Smile className="flex-shrink-0" />
              <span className="text-wrap text-left">Out of Stock</span>
            </div>
          ) : inventory?.stock_status === StockStatus.LOW_STOCK ? (
            <div className="flex items-center gap-[8px]">
              <ShoppingCart className="flex-shrink-0 animate-bounce" />
              <span className="text-wrap text-left">
                Order now! Only {inventory.quantity} left
              </span>
            </div>
          ) : null}
        </Button>
      </div>
      <div className="info-wrapper mt-[12px] flex flex-col justify-between gap-[8px] sm:flex-row">
        <div className="info">
          {/* Image */}
          <Link
            href={link}
            className="info__name font-roboto-medium text-body-big duration-300 hover:text-green-100"
          >
            {name}
          </Link>
          {/* Information */}
          <div className="info__price-wrapper mt-2">
            {percentageDiscount !== 0 ? (
              <>
                <span className="info__discount mr-[6px] text-body-sub text-green-200 line-through">
                  {formatCurrency(price || 0)}
                </span>
                <span className="info__price text-body-big">
                  {formatCurrency(price_after_discounts || 0)}
                </span>
              </>
            ) : (
              <span className="info__price text-body-big">
                {formatCurrency(price || 0)}
              </span>
            )}
          </div>
        </div>
        {renderAction && <div className="action">{renderAction()}</div>}
      </div>
    </div>
  );
};

type CardBlogProps = Omit<
  CardProps,
  "beforeDiscountedPrice" | "price" | "name"
> & {
  userAvatarUrl: string | StaticImageData;
  blogTitle: string;
  authorName: string;
  created_at: string;
};

export const CardBlog = ({
  children,
  classes,
  imgUrl,
  userAvatarUrl,
  authorName,
  created_at,
  blogTitle,
  link,
  renderAction,
}: CardBlogProps) => {
  return (
    <div
      className={cn(
        "card blog-card aspect-[360/630] h-full max-h-[360px] w-full rounded-[14px] bg-white/60 p-6 shadow-sm",
        "flex flex-col justify-between",
        classes,
      )}
    >
      <Link
        href={link}
        className="blog-card__img group relative flex h-[80%] w-full flex-1 items-center justify-center overflow-hidden rounded-[14px] bg-white"
      >
        {typeof imgUrl === "string" ? (
          <img
            src={imgUrl}
            alt={blogTitle}
            width={286}
            height={360}
            className="h-full w-full object-contain object-center duration-300 group-hover:scale-110"
          />
        ) : (
          <Image
            src={imgUrl}
            alt={blogTitle}
            width={286}
            height={360}
            className="h-full w-full object-contain object-center duration-300 group-hover:scale-110"
          />
        )}
      </Link>
      <div className="info-wrapper mt-[12px] flex flex-col justify-between gap-[8px]">
        <div className="info__author flex items-center gap-[8px]">
          <div className="info__author-avatar aspect-square h-[28px] overflow-hidden rounded-full">
            {typeof userAvatarUrl === "string" ? (
              <img
                src={userAvatarUrl}
                alt={authorName}
                width={40}
                height={40}
                className="h-full w-full object-cover duration-300 group-hover:scale-110"
              />
            ) : (
              <Image
                src={userAvatarUrl}
                alt={authorName}
                width={40}
                height={40}
                className="h-full w-full object-cover duration-300 group-hover:scale-110"
              />
            )}
          </div>
          <span className="info__author-name font-roboto-medium text-body-sub">
            {authorName}
          </span>
          <span>-</span>
          <span className="info__author-date text-body-sub">{created_at}</span>
        </div>
        <div className="info__title mt-[20px]">
          <Link href={link} className="font-roboto-medium text-body-big">
            {blogTitle}
          </Link>
        </div>
        {renderAction && <div className="action">{renderAction()}</div>}
      </div>
    </div>
  );
};

export default Card;
