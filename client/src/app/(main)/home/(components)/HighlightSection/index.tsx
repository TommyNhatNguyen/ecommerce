import React from "react";
import bannerImage from "../../../../resources/images/homepage/subhero-banner.jpg";
import Image from "next/image";
import { ButtonWithLink } from "@/app/shared/components/Button";
import { ROUTES } from "@/app/constants/routes";
import { ChevronRightIcon } from "lucide-react";
type Props = {};

const HighlightSection = (props: Props) => {
  return (
    <section id="highlight" className="highlight mt-section">
      <div
        className="highlight__banner relative h-full min-h-[661px] w-full"
        style={{
          backgroundImage: `url(${bannerImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="highlight__banner-info bg-bg-primary-70 absolute left-[50%] top-[50%] flex w-full max-w-[80%] -translate-x-[50%] -translate-y-[50%] items-start justify-between gap-gutter rounded-2xl p-[32px] shadow-md backdrop-blur-md">
          <div className="titlegroup flex-1">
            <h2 className="titlegroup__title font-playright-bold text-h2 text-green-200">
              Have a Look at Our Unique Selling Proportions
            </h2>
            <ButtonWithLink
              link={ROUTES.PRODUCTS}
              classes="h-btn px-[24px] text-center text-white text-primary-btn rounded-[64px] bg-gray-200 hover:bg-gray-100 duration-300 flex items-center justify-center gap-2 mt-[30px]"
            >
              <span className="h-full content-center text-nowrap">
                Read more
              </span>
              <ChevronRightIcon
                width={20}
                height={20}
                className="h-full content-center text-nowrap"
              />
            </ButtonWithLink>
          </div>
          <div className="highlights flex-1">
            <p className="highlights__desc">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa
              repudiandae perferendis fugiat. Dignissimos, ab! Ut, nostrum
              facere distinctio minima dolor velit nihil nulla corrupti ex
              voluptatem. Explicabo corrupti dignissimos nihil!
            </p>
            <div className="highlights__facts mt-[32px] flex items-center gap-gutter">
              <div className="highlights__facts-item">
                <span className="font-roboto-bold text-[4.8rem] text-pink-200">
                  99%
                </span>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident rem laudantium eveniet exercitationem sit aliquid
                </p>
              </div>
              <div className="highlights__facts-item">
                <span className="font-roboto-bold text-[4.8rem] text-pink-200">
                  100%
                </span>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Provident rem laudantium eveniet exercitationem sit aliquid
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightSection;
