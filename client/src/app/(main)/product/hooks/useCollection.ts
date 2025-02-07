import { useState } from "react";

export const useCollection = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    from: number;
    to: number;
  }>({
    from: 0,
    to: 100000000,
  });
  const [applyPriceRange, setApplyPriceRange] = useState<{
    from: number | undefined;
    to: number | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const handleApplyPriceRange = (data: { from: number; to: number }) => {
    setApplyPriceRange(data);
  };
  const handleChangePriceRange = (id: string, value: number) => {
    setPriceRange((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleGetSelectedOptions = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedOptions((prev) => [...prev, id]);
    }
  };
  return {
    selectedOptions,
    handleGetSelectedOptions,
    handleApplyPriceRange,
    handleChangePriceRange,
    priceRange,
    applyPriceRange,
  };
};
