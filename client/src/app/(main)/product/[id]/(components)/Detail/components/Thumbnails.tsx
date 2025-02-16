import React, { useRef, useState } from "react";
import Button from "@/app/shared/components/Button";
import { ImageModel } from "@/app/shared/models/images/images.model";
import CustomSlickSlider from "@/app/shared/components/CustomSlickSlider";
import { cn } from "@/app/shared/utils/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Slider from "react-slick";
import NoImageComponent from "@/app/shared/components/NoImageComponent";
type Props = {
  images: ImageModel[];
};

const Thumbnails = ({ images }: Props) => {
  const [activeSlide, setActiveSlide] = useState<number>();
  const slickSliderRef = useRef<Slider | null>();
  const _onSlickNext = () => {
    slickSliderRef.current?.slickNext();
  };
  const _onSlickPrev = () => {
    slickSliderRef.current?.slickPrev();
  };
  return (
    <div className="slider-container relative h-full w-full">
      {images && images?.length > 0 ? (
        <div className="relative h-full w-full">
          <CustomSlickSlider
            ref={slickSliderRef as any}
            beforeChange={(_, nextSlide) => {
              setActiveSlide(nextSlide);
            }}
            customPaging={function (i) {
              return (
                <div
                  className={cn(
                    "mb-4 overflow-hidden rounded-md opacity-60 duration-300",
                    activeSlide == i ? "slick-current opacity-100" : "",
                  )}
                >
                  <img src={images?.[i]?.url} alt="" />
                </div>
              );
            }}
            className="relative h-full w-full"
            adaptiveHeight={false}
            dotsClass="max-w-[10%] absolute top-4 left-4 flex flex-col gap-2  overflow-y-auto max-h-[50%]"
            slidesToShow={1}
            fade={true}
            focusOnSelect={true}
            arrows={false}
          >
            {images.map((img) => {
              return (
                <div className="slick-image h-full overflow-hidden rounded-md bg-white p-4">
                  <img
                    src={img?.url || ""}
                    alt={img?.type || ""}
                    className="absolute left-0 top-0 h-full w-full rounded-md object-contain object-center"
                  />
                </div>
              );
            })}
          </CustomSlickSlider>
          <div className="absolute bottom-6 right-4 z-10 flex items-center gap-4">
            <Button variant="icon" onClick={_onSlickPrev}>
              <ArrowLeft />
            </Button>
            <Button variant="icon" onClick={_onSlickNext}>
              <ArrowRight />
            </Button>
          </div>
        </div>
      ) : (
        <NoImageComponent className={"h-full w-full"} />
      )}
    </div>
  );
};

export default Thumbnails;
