import { useState } from "react";

export const useCollection = () => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const handleGetSelectedOptions = (id: string) => {
    if (selectedOptions.includes(id)) {
      setSelectedOptions(prev => prev.filter(item => item !== id ))
    } else {
      setSelectedOptions(prev => [...prev, id])
    
  };
}
return { selectedOptions, handleGetSelectedOptions };
};
