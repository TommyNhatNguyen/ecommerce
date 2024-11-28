import React from "react";
import Container from "@/app/shared/components/Container";
import Filter from "@/app/(main)/product/(components)/Filter";

import Collection from "@/app/(main)/product/(components)/Collection";
type Props = {};

const ProductPage = (props: Props) => {
  return (
    <main id="product-page" className="product-page py-section">
      <Container>
        <div className="product-page-wrapper grid grid-cols-[1fr,3.2fr] gap-gutter">
          <Filter />
          <Collection />
        </div>
      </Container>
    </main>
  );
};

export default ProductPage;
