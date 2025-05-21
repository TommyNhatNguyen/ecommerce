import React from "react";
import InventoryVariantTable from "./data-table";
import { useIntl } from "react-intl";
import { inventoryVariantColumns } from "./columns";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";

type Props = {
  data: VariantProductModel[];
  updatedCell: string;
  setUpdatedCell: (updatedCell: string) => void;
};

const VariantSettingTable = ({ data, updatedCell, setUpdatedCell }: Props) => {
  const intl = useIntl();
  return (
    <InventoryVariantTable
      columns={inventoryVariantColumns(intl)}
      data={data}
      updatedCell={updatedCell}
      setUpdatedCell={setUpdatedCell}
    />
  );
};

export default VariantSettingTable;
