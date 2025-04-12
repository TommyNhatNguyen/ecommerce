"use client";
import CostCard from "@/app/(dashboard)/admin/(content)/orders/settings/components/CostCard";
import DiscountCampaign from "@/app/(dashboard)/admin/(content)/orders/settings/components/DiscountCampaign";
import PaymentMethod from "@/app/(dashboard)/admin/(content)/orders/settings/components/PaymentMethod";
import ShippingCard from "@/app/(dashboard)/admin/(content)/orders/settings/components/ShippingCard";
import React from "react";

type Props = {};
const SettingsPage = (props: Props) => {
  return (
    <div className="grid h-full grid-flow-row grid-cols-2 gap-4">
      <ShippingCard />
      <PaymentMethod />
      <DiscountCampaign />
      <CostCard />
    </div>
  );
};

export default SettingsPage;
