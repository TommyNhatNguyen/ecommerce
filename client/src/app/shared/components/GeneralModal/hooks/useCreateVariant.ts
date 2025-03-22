import { CreateVariantDTOV2 } from "@/app/shared/interfaces/variant/variant.interface";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { useState } from "react";

export const useCreateVariant = () => {
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const handleCreateVariant = async (payload: CreateVariantDTOV2) => {
    try {
      setIsCreateLoading(true);
      const response = await variantServices.create(payload);
      return response;
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreateLoading(false);
    }
  };

  return {
    isCreateLoading,
    handleCreateVariant,
  };
};
