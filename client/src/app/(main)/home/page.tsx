import BannerSection from "@/app/(main)/home/(components)/BannerSection";
import BlogSection from "@/app/(main)/home/(components)/BlogSection";
import CategorySection from "@/app/(main)/home/(components)/CategorySection";
import FAQSection from "@/app/(main)/home/(components)/FAQSection";
import FeatureSection from "@/app/(main)/home/(components)/FeatureSection";
import Hero from "@/app/(main)/home/(components)/Hero";
import HighlightSection from "@/app/(main)/home/(components)/HighlightSection";
import ProductSection from "@/app/(main)/home/(components)/ProductSection";
import React from "react";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <main id="home" className="main">
      <Hero />
      <FeatureSection />
      <CategorySection />
      <ProductSection />
      <HighlightSection />
      <BlogSection />
      <FAQSection />
      <BannerSection />
    </main>
  );
};

export default HomePage;
