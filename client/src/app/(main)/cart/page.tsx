import Products from "@/app/(main)/cart/(components)/Products";
import Total from "@/app/(main)/cart/(components)/Total";
import { ROUTES } from "@/app/constants/routes";
import Button from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import SimilarCardComponent from "@/app/shared/components/SimilarCardComponent";
import Table from "@/app/shared/components/Table";
import { X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import mockProductImage from "@/app/resources/images/homepage/product-2.jpg";
type CartPagePropsType = {};
const products = [
  {
    imgUrl: mockProductImage,
    name: "Product 1",
    price: 100,
    link: ROUTES.PRODUCT_DETAIL,
    beforeDiscountedPrice: 250,
  },
  {
    imgUrl: mockProductImage,
    name: "Product 2",
    price: 150,
    link: ROUTES.PRODUCT_DETAIL,
    beforeDiscountedPrice: 250,
  },
  {
    imgUrl: mockProductImage,
    name: "Product 3",
    price: 200,
    link: ROUTES.PRODUCT_DETAIL,
    beforeDiscountedPrice: 250,
  },
  {
    imgUrl: mockProductImage,
    name: "Product 4",
    price: 250,
    link: ROUTES.PRODUCT_DETAIL,
    beforeDiscountedPrice: 500,
  },
];
const CartPage = (props: CartPagePropsType) => {
  return (
    <main id="cart" className="cart pt-section">
      <Container>
        <section className="cart-wrapper grid h-full w-full grid-cols-[1.4fr,1fr] items-start justify-between gap-gutter">
          <Products />
          <Total />
        </section>
      </Container>
      <SimilarCardComponent
        sectionClasses="py-section"
        productsList={products}
        title="You may also like"
        withButton={false}
      />
    </main>
  );
};

export default CartPage;
