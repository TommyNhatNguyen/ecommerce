import React from "react";
import InventoryVariantTable from "./data-table";
import { useIntl } from "react-intl";
import { inventoryVariantColumns } from "./columns";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";

type Props = {
  data: VariantProductModel[];
};

const VariantSettingTable = ({ data }: Props) => {
  const intl = useIntl();
  return (
    <InventoryVariantTable
      columns={inventoryVariantColumns(intl)}
      data={data}
    />
  );
};

export default VariantSettingTable;
