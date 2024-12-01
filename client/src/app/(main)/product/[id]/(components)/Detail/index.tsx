import Info from "@/app/(main)/product/[id]/(components)/Detail/components/Info";
import Thumbnails from "@/app/(main)/product/[id]/(components)/Detail/components/Thumbnails";
import { ROUTES } from "@/app/constants/routes";
import Breadcrumb from "@/app/shared/components/Breadcrumb";
import Button from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import { Heart, Star } from "lucide-react";
import React from "react";

type Props = {};

const Detail = (props: Props) => {
  return (
    <section className="product-detail__detail">
      <Container>
        <Breadcrumb>
          <Breadcrumb.Link link={ROUTES.HOME}>Home</Breadcrumb.Link>
          <Breadcrumb.Link link={ROUTES.PRODUCTS}>Product</Breadcrumb.Link>
          <Breadcrumb.Item>Detail</Breadcrumb.Item>
        </Breadcrumb>
        <div className="content mt-[20px] grid grid-cols-[1.34fr_1fr] items-start justify-between gap-gutter">
          <Thumbnails />
          <Info />
        </div>
      </Container>
    </section>
  );
};

export default Detail;
