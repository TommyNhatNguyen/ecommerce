"use client";
import Description from "@/app/(main)/product/[id]/(components)/Reviews/components/Description";
import ReviewsDetail from "@/app/(main)/product/[id]/(components)/Reviews/components/ReviewsDetail";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import clsx from "clsx";
import React, { useState } from "react";
import { ProductModel } from "@/app/shared/models/products/products.model";

type ReviewsPropsType = {
  productInfo: ProductModel | undefined;
};

const Reviews = ({ productInfo }: ReviewsPropsType) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description",
  );
  const _onTabChange = (tab: "description" | "reviews") => {
    setActiveTab(tab);
  };
  return (
    <section className="product-detail__reviews my-section bg-green-100">
      <Container classes="px-[80px] py-10">
        <ul className="tabs flex items-center">
          <li>
            <Button
              className={clsx(
                "pr-[20px] font-roboto-bold text-h3",
                activeTab === "description"
                  ? "active text-bg-secondary"
                  : "text-white",
              )}
              onClick={() => _onTabChange("description")}
            >
              Description
            </Button>
          </li>
          <li>
            <Button
              className={clsx(
                "border-l pl-[20px] font-roboto-bold text-h3",
                activeTab === "reviews"
                  ? "active text-bg-secondary"
                  : "text-white",
              )}
              onClick={() => _onTabChange("reviews")}
            >
              Reviews
            </Button>
          </li>
        </ul>
        <div className="content mt-[40px]">
          {activeTab === "description" && (
            <Description
              description={productInfo?.description || ""}
              name={productInfo?.name || ""}
            />
          )}
          {activeTab === "reviews" && <ReviewsDetail />}
        </div>
      </Container>
    </section>
  );
};

export default Reviews;
