import { VariantModel } from "@/app/shared/models/variant/variant.model";

export const buildVariantTree = (variants: VariantModel[]) => {
  const newData: {
    [type: string]: { name: string; value: string; is_color: boolean, id: string }[];
    } = {};
    variants.forEach((item) => {
      const value: { name: string; value: string; is_color: boolean, id: string } = {
        name: item.name,
        value: item.value,
        is_color: item.is_color,
        id: item.id,
      };
    newData[item.type] = newData[item.type]
      ? [...newData[item.type], value]
      : [value];
  });
  return newData;
};
