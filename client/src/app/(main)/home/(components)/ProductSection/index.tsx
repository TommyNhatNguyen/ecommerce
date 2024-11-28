"use client";
import Button from "@/app/shared/components/Button";
import { ROUTES } from "@/app/constants/routes";
import { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { ChevronRightIcon, PlusCircle } from "lucide-react";
import React from "react";
import mockProductImage from "../../../../resources/images/homepage/product-2.jpg";
import { CardProduct } from "@/app/shared/components/Card";
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

type Props = {};

type Product = (typeof products)[number];

const ProductSection = (props: Props) => {
  const _onAddToCart = (product: Product) => {
    console.log(product);
  };
  return (
    <section id="product" className="product mt-section">
      <Container>
        <Titlegroup classes="product__title flex items-center justify-between gap-gutter">
          <Titlegroup.Info classes="max-w-[50%]">
            <Titlegroup.Title>Most Popular Products</Titlegroup.Title>
            <Titlegroup.Description classes="mt-[16px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvinar.
            </Titlegroup.Description>
          </Titlegroup.Info>
          <ButtonWithLink
            link={ROUTES.PRODUCTS}
            classes="h-btn px-[24px] text-center text-white text-primary-btn rounded-[64px] bg-pink-200 hover:bg-pink-100 duration-300 flex items-center justify-center gap-2"
          >
            <span className="h-full content-center text-nowrap">
              View All Products
            </span>
            <ChevronRightIcon
              width={20}
              height={20}
              className="h-full content-center text-nowrap"
            />
          </ButtonWithLink>
        </Titlegroup>
        <div className="product__group`">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="product__group-list mt-[36px] flex items-center justify-between gap-gutter"
            >
              {products.map((product) => (
                <CardProduct
                  key={product.name}
                  {...product}
                  renderAction={() => (
                    <Button onClick={() => _onAddToCart(product)}>
                      <PlusCircle width={24} height={24} />
                    </Button>
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;
