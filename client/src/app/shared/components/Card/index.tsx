import { ROUTES } from "@/app/constants/routes";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import {
  cn,
  formatCurrency,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import clsx from "clsx";
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
  return <div className={clsx("card", classes)}>{children}</div>;
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
  const { price, total_discounts, price_after_discounts, image } =
    showVariant || {};
  const imgUrl = image?.[0]?.url || "";
  const percentageDiscount =
    (total_discounts && price && (total_discounts / price) * 100) || 0;
  return (
    <div
      className={cn(
        "card product-card h-full min-h-[360px] max-h-[480px] w-full rounded-[14px] bg-white/60 p-6 shadow-sm",
        "flex flex-col justify-between",
        classes,
      )}
    >
      <Link
        href={link}
        className="product-card__img group relative flex h-[80%] min-h-[80%] w-full flex-1 items-center justify-center overflow-hidden rounded-[14px] bg-white"
      >
        {typeof imgUrl === "string" ? (
          <img
            src={imgUrl}
            alt={name}
            width={286}
            height={360}
            className="h-full w-full object-contain object-center duration-300 group-hover:scale-110"
          />
        ) : (
          <Image
            src={imgUrl}
            alt={name}
            width={286}
            height={360}
            className="h-full w-full object-contain object-center duration-300 group-hover:scale-110"
          />
        )}
        {percentageDiscount !== 0 && (
          <div className="discount absolute left-[12px] top-[12px] content-center rounded-[10px] bg-pink-200 px-[12px] py-[6px] text-center text-body-sub text-white">
            <span className="discount__text">
              {formatDiscountPercentage(percentageDiscount)}
            </span>
          </div>
        )}
      </Link>
      <div className="info-wrapper mt-[12px] flex items-end justify-between gap-[8px]">
        <div className="info">
          <Link
            href={link}
            className="info__name font-roboto-medium text-body-big"
          >
            {name}
          </Link>
          <div className="info__price-wrapper">
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
    <div className={clsx("card blog-card h-full w-full", classes)}>
      <Link
        href={link}
        className="blog-card__img group relative block aspect-[286/360] h-full w-full overflow-hidden rounded-[14px]"
      >
        {typeof imgUrl === "string" ? (
          <img
            src={imgUrl}
            alt={blogTitle}
            width={286}
            height={360}
            className="h-full w-full object-cover duration-300 group-hover:scale-110"
          />
        ) : (
          <Image
            src={imgUrl}
            alt={blogTitle}
            width={286}
            height={360}
            className="h-full w-full object-cover duration-300 group-hover:scale-110"
          />
        )}
      </Link>
      <div className="info-wrapper mt-[30px]">
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
