"use client";
import React from "react";
import AttributesFilter from "@/app/(dashboard)/admin/(content)/inventory/products/attributes/components/AttributesFilter";
import AttributesTable from "@/app/(dashboard)/admin/(content)/inventory/products/attributes/components/AttributesTable";
import { useAttributesFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/attributes/hooks/useAttributesFilter";

type Props = {};

const AttributesPage = (props: Props) => {
  const { limit, ...rest } = useAttributesFilter();
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <AttributesFilter limit={limit} {...rest} />
      </div>
      <div className="col-span-10">
        <AttributesTable limit={limit} />
      </div>
    </div>
  );
};

export default AttributesPage;
