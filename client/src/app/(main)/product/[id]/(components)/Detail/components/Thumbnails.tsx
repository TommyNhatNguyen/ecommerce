import React from "react";
import productImg from "@/app/resources/images/homepage/product-1.jpg";
import Button from "@/app/shared/components/Button";
type Props = {};

const Thumbnails = (props: Props) => {
  return (
    <div className="content__images grid h-full w-full grid-cols-[1fr_3.5fr] gap-gutter">
      <div className="content__images-thumbnails flex h-full w-full flex-col gap-[20px]">
        <Button className="img h-full w-full rounded-4px overflow-hidden">
          <img
            src={productImg.src}
            alt="product image"
            className="h-full w-full object-cover"
          />
        </Button>
        <Button className="img h-full w-full rounded-4px overflow-hidden">
          <img
            src={productImg.src}
            alt="product image"
            className="h-full w-full object-cover"
          />
        </Button>
        <Button className="img h-full w-full rounded-4px overflow-hidden">
          <img
            src={productImg.src}
            alt="product image"
            className="h-full w-full object-cover"
          />
        </Button>
      </div>
      <Button className="content__images-hero h-full w-full rounded-[4px] overflow-hidden">
        <img
          src={productImg.src}
          alt="product image"
          className="h-full w-full object-cover"
        />
      </Button>
    </div>
  );
};

export default Thumbnails;
