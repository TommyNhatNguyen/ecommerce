import Image from "next/image";
import React from "react";
import bannerImage from "../../../resources/images/homepage/banner-1.png";
import Container from "@/app/shared/components/Container";
type Props = {};

const BannerSection = (props: Props) => {
  return (
    <section id="banner" className="banner section h-[137px] bg-bg-secondary">
      <Container>
        <div className="banner__imglist flex h-full w-full items-center justify-evenly gap-[8px]">
          <div className="banner__imglist-item max-h-[25px] max-w-[139px]">
            <Image
              src={bannerImage}
              alt="banner"
              width={139}
              height={25}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="banner__imglist-item max-h-[25px] max-w-[139px]">
            <Image
              src={bannerImage}
              alt="banner"
              width={139}
              height={25}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="banner__imglist-item max-h-[25px] max-w-[139px]">
            <Image
              src={bannerImage}
              alt="banner"
              width={139}
              height={25}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="banner__imglist-item max-h-[25px] max-w-[139px]">
            <Image
              src={bannerImage}
              alt="banner"
              width={139}
              height={25}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="banner__imglist-item max-h-[25px] max-w-[139px]">
            <Image
              src={bannerImage}
              alt="banner"
              width={139}
              height={25}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="banner__imglist-item max-h-[25px] max-w-[139px]">
            <Image
              src={bannerImage}
              alt="banner"
              width={139}
              height={25}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BannerSection;
