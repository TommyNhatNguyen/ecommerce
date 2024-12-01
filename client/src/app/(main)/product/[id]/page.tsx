import Detail from "@/app/(main)/product/[id]/(components)/Detail";
import Reviews from "@/app/(main)/product/[id]/(components)/Reviews";
import SimilarCardComponent from "@/app/shared/components/SimilarCardComponent";
import React from "react";

type Props = {};

const ProductDetailPage = (props: Props) => {
  return (
    <main id="product-detail" className="product-detail py-section">
      <Detail />
      <Reviews />
      <SimilarCardComponent />
    </main>
  );
};

export default ProductDetailPage;
