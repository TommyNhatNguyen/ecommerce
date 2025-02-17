"use client";
import { ROUTES } from "@/app/constants/routes";
import { ButtonWithLink } from "@/app/shared/components/Button";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

const CartDropdown = (props: Props) => {
  const [open, setOpen] = useState(false);
  const { cartInfo } = useCustomerAppSelector((state) => state.cart);
  const _onClose = () => {
    setOpen(false);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="cta__cart-cart relative">
        <ShoppingCart />
        <Badge className="absolute -right-2 -top-2 aspect-square rounded-full">
          {cartInfo?.product_count || 0}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="cta__cart-dropdown min-w-[300px] overflow-y-auto rounded-md bg-custom-white p-2 shadow-md">
        <DropdownMenuLabel>Recent added items:</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex max-h-[300px] w-full flex-col items-start gap-2 overflow-y-auto">
          {cartInfo  &&
            cartInfo?.product_sellable &&
            cartInfo?.product_sellable?.map((item) => {
              const {
                price,
                price_after_discounts,
                image,
                variant,
                cart_product_sellable,
              } = item;
              return (
                <Link
                  href={`${ROUTES.PRODUCTS}/${variant?.product_id}`}
                  className="flex w-full items-start gap-2 p-2 duration-300 hover:bg-bg-primary-60"
                  onClick={_onClose}
                >
                  {/* Image */}
                  <div className="aspect-square h-16 w-16 flex-shrink-0 bg-white">
                    <img
                      className="h-full w-full object-contain"
                      src={image?.[0]?.url}
                      alt={variant?.name}
                    />
                  </div>
                  {/* Product information */}
                  <div>
                    <p className="font-roboto-medium text-body-text">
                      {variant?.name}
                    </p>
                    <p className="text-footer">
                      <span className="font-roboto-medium">Quantity:</span>{" "}
                      {formatNumber(cart_product_sellable?.quantity || 0)}
                    </p>
                    <p className="text-footer">
                      <span className="font-roboto-medium">Total:</span>{" "}
                      {formatCurrency(cart_product_sellable?.total || 0)}
                    </p>
                  </div>
                  {/* Price information */}
                  <div className="flex flex-1 flex-col items-end gap-1">
                    {price == price_after_discounts ? (
                      <p className="font-roboto-medium text-footer">
                        {formatCurrency(price || 0)}
                      </p>
                    ) : (
                      <>
                        <p className="text-footer line-through">
                          {formatCurrency(price || 0)}
                        </p>
                        <p className="font-roboto-medium text-footer">
                          {formatCurrency(price_after_discounts || 0)}
                        </p>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex w-full items-center gap-4">
            {/* Total of unique items */}
            <span className="flex-shrink-0 text-footer text-green-100">
              Total items in cart:{" "}
              {formatNumber(cartInfo?.product_quantity || 0)}
            </span>
            {/* Button view cart */}
            <ButtonWithLink
              variant="primary"
              link={ROUTES.CART}
              classes="w-full flex-1"
              onClick={_onClose}
            >
              View cart
            </ButtonWithLink>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
