import React from "react";
import Button from "@/app/shared/components/Button";
import { ImageModel } from "@/app/shared/models/images/images.model";
type Props = {
  images: ImageModel[];
};

const Thumbnails = ({ images }: Props) => {
  const mainImage = images?.[0];
  const otherImages = images?.slice(1);
  return (
    <div className="content__images grid h-full w-full grid-cols-[1fr_3.5fr] gap-gutter">
      <div className="content__images-thumbnails flex h-full w-full flex-col gap-[20px]">
        {otherImages?.map((item) => {
          return (
            <Button className="img rounded-4px h-full w-full overflow-hidden">
              <img
                src={item?.url}
                alt="product image"
                className="h-full w-full object-fill"
              />
            </Button>
          );
        })}
      </div>
      <Button className="content__images-hero h-full w-full overflow-hidden rounded-[4px]">
        <img
          src={mainImage?.url}
          alt="product image"
          className="h-full w-full object-fill"
        />
      </Button>
    </div>
  );
};

export default Thumbnails;
