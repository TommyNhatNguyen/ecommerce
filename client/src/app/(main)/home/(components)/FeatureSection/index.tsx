"use client";
import Button from "@/app/shared/components/Button";
import { CardProduct } from "@/app/shared/components/Card";
import Container from "@/app/shared/components/Container";
import Titlegroup from "@/app/shared/components/Titlegroup";
import { PlusCircle } from "lucide-react";
import React from "react";
import mockProductImage from "../../../../resources/images/homepage/product-1.jpg";
import { ROUTES } from "@/app/constants/routes";
type Props = {};

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
type Product = (typeof products)[number];

const FeatureSection = (props: Props) => {
  const _onAddToCart = (product: Product) => {
    console.log(product);
  };
  return (
    <section id="feature" className="feature mt-[100px]">
      <Container>
        <Titlegroup classes="flex items-end justify-between">
          <Titlegroup.Title>Featured Products</Titlegroup.Title>
          <Titlegroup.Info classes="max-w-[40%]">
            <Titlegroup.Description>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvina.
            </Titlegroup.Description>
          </Titlegroup.Info>
        </Titlegroup>
        <div className="feature__products mt-[36px] flex items-center justify-between gap-gutter">
          {products.map((product) => (
            <CardProduct
              key={product.name}
              {...product}
              renderAction={() => (
                <Button onClick={() => _onAddToCart(product)} variant="vanilla">
                  <PlusCircle width={24} height={24} />
                </Button>
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeatureSection;
