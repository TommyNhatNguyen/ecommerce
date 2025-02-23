"use client";
import Total from "@/app/(main)/cart/(components)/Total";
import { ROUTES } from "@/app/constants/routes";
import Button from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import SimilarCardComponent from "@/app/shared/components/SimilarCardComponent";
import Table from "@/app/shared/components/Table";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import mockProductImage from "@/app/shared/resources/images/homepage/product-2.jpg";
import { twMerge } from "tailwind-merge";
import { useCustomerAppSelector } from "@/app/shared/hooks/useRedux";
import Products from "@/app/(main)/cart/(components)/Products";
type CartPagePropsType = {};
const CartPage = (props: CartPagePropsType) => {
  const router = useRouter();
  const handleCheckout = () => {
    router.push(ROUTES.CHECKOUT);
  };
  const { cartInfo } = useCustomerAppSelector((state) => state.cart);
  console.log("🚀 ~ CartPage ~ cartInfo:", cartInfo);

  const totalProps = { handleCheckout };
  return (
    <main id="cart" className="cart pt-section">
      <Container>
        <section className="cart-wrapper grid h-full w-full grid-cols-[1.4fr,1fr] items-start justify-between gap-gutter">
          <div>
            {/*
            PRODUCT TABLE:
            -------------- 
            Select all checkbox
            Select checkbox 
            Image carousel
            Product name
            Variant name
            Short description
            Variant options
            Product discount type
            Price
            Quantity with + - button
            Subtotal 
            Total discount
            Total
            Remove button
            */}
          </div>
          <div>
            {/*
            TOTAL TABLE:
            -------------- 
            Subtotal
            Total discount
            (Total product discount)
            (Total order discount)
            Discount code input
            Total
            */}
          </div>
          <Products />
          <Total {...totalProps} />
        </section>
      </Container>
      <SimilarCardComponent
        sectionClasses="py-section"
        title="You may also like"
        withButton={false}
      />
    </main>
  );
};

export default CartPage;
