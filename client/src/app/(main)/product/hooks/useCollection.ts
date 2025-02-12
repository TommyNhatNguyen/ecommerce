import { useState } from "react";

export const DEFAULT_MAX_PRICE = 10000000000000;

export const useCollection = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    from: number;
    to: number;
  }>({
    from: 0,
    to: DEFAULT_MAX_PRICE,
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
  const handleSetSelectedOptions = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedOptions((prev) => [...prev, id]);
    }
  };
  const handleResetOptions = () => {
    setSelectedOptions([]);
    setPriceRange({ from: 0, to: DEFAULT_MAX_PRICE });
    setApplyPriceRange({ from: 0, to: DEFAULT_MAX_PRICE });
  };
  return {
    selectedOptions,
    handleSetSelectedOptions,
    handleApplyPriceRange,
    handleChangePriceRange,
    handleResetOptions,
    priceRange,
    applyPriceRange,
  };
};
