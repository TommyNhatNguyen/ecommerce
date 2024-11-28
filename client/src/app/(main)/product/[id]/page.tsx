import Detail from "@/app/(main)/product/[id]/(components)/Detail";
import Reviews from "@/app/(main)/product/[id]/(components)/Reviews";
import SimilarCardComponent from "@/app/shared/components/SimilarCardComponent";
import React from "react";

type Props = {};

const ProductDetailPage = (props: Props) => {
  return (
    <main id="product-detail" className="product-detail py-section">
      <section className="product-detail__detail">
        <Detail />
      </section>
      <section className="product-detail__reviews">
        <Reviews />
      </section>
      <section className="similar-section">
        <SimilarCardComponent />
      </section>
    </main>
  );
};

export default ProductDetailPage;
