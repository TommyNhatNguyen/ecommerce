import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import React, { LegacyRef, Ref, forwardRef } from "react";
import Slider, { Settings } from "react-slick";

type CustomSlickSliderPropsType = {
  children: React.ReactNode;
} & Settings;

const CustomSlickSlider = (
  { children, ...props }: CustomSlickSliderPropsType,
  ref: LegacyRef<Slider> | undefined,
) => {
  return (
    // @ts-ignore
    <Slider
      dots={true}
      infinite={false}
      slidesToScroll={1}
      slidesToShow={4}
      swipeToSlide={true}
      prevArrow={<ArrowLeftCircle />}
      nextArrow={<ArrowRightCircle />}
      {...props}
      ref={ref}
    >
      {children}
    </Slider>
  );
};

export default forwardRef(CustomSlickSlider);
