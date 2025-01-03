"use client";
import Description from "@/app/(main)/product/[id]/(components)/Reviews/components/Description";
import ReviewsDetail from "@/app/(main)/product/[id]/(components)/Reviews/components/ReviewsDetail";
import Button, { ButtonWithLink } from "@/app/shared/components/Button";
import Container from "@/app/shared/components/Container";
import clsx from "clsx";
import React, { useState } from "react";

type Props = {};

const Reviews = (props: Props) => {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "reviews",
  );
  const _onTabChange = (tab: "description" | "reviews") => {
    setActiveTab(tab);
  };
  return (
    <section className="product-detail__reviews my-section bg-green-100">
      <Container classes="px-[80px] py-[100px]">
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
          {activeTab === "description" && <Description />}
          {activeTab === "reviews" && <ReviewsDetail />}
        </div>
      </Container>
    </section>
  );
};

export default Reviews;
