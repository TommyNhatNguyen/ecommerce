import Detail from "@/app/(main)/product/[id]/(components)/Detail";
import Reviews from "@/app/(main)/product/[id]/(components)/Reviews";
import { ROUTES } from "@/app/constants/routes";
import SimilarCardComponent from "@/app/shared/components/SimilarCardComponent";
import React from "react";
import mockProductImage from "@/app/shared/resources/images/homepage/product-2.jpg";
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
const ProductDetailPage = (props: Props) => {
  return (
    <main id="product-detail" className="product-detail py-section">
      <Detail />
      <Reviews />
      <SimilarCardComponent productsList={products} title="Similar product" />
    </main>
  );
};

export default ProductDetailPage;
