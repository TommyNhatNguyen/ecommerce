"use client";
import Button from "@/app/shared/components/Button";
import Form from "@/app/shared/components/Form";
import { ChevronRightIcon, Search } from "lucide-react";
import React from "react";
import mockProductImage from "../../../../resources/images/homepage/product-2.jpg";
import { CardProduct } from "@/app/shared/components/Card";
import { PlusCircle } from "lucide-react";
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
];

type Product = (typeof products)[number];

const Collection = (props: Props) => {
  const _onAddToCart = (product: Product) => {
    console.log(product);
  };
  const _onLoadMore = () => {
    console.log("load more");
  };
  return (
    <div className="product-page__content">
      <div className="product-page__content-title">
        <h1 className="font-playright-bold text-h1">
          Our Collection Of Products
        </h1>
        <Form className="mt-[32px] w-full">
          <Form.Group
            classes="h-input rounded-[42px] w-full border-green-300  flex items-center justify-between pl-[20px] pr-[10px] py-[10px] hover:border-green-100 duration-300 focus-within:border-green-100 gap-[8px]"
            renderIcon={() => (
              <Button variant="icon">
                <Search className="text-white" width={18} height={18} />
              </Button>
            )}
          >
            <Form.Input placeholder="Search An Item" />
          </Form.Group>
        </Form>
      </div>
      <div className="product-page__content-list mt-[32px]">
        <div className="total">
          <p className="font-roboto-medium">Showing 1–12 of 24 item(s)</p>
          <p className="text-body-sub">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="product__group">
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
                    <Button variant="vanilla" onClick={() => _onAddToCart(product)}>
                      <PlusCircle width={24} height={24} />
                    </Button>
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="pagination mx-auto mt-[96px] w-full max-w-[500px] text-center">
          <p className="font-roboto-medium">Showing 1–12 of 24 item(s)</p>
          <div className="progress relative mt-[26px] h-[4px] w-full rounded-[2px] bg-gray-100">
            <span className="progress-indicator absolute left-0 top-0 h-full w-[50%] rounded-full bg-green-300"></span>
          </div>
          <Button
            onClick={_onLoadMore}
            variant="primary"
            classes="mx-auto mt-[26px]"
          >
            <span className="h-full content-center text-nowrap">Load More</span>
            <ChevronRightIcon
              width={20}
              height={20}
              className="h-full content-center text-nowrap"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Collection;
