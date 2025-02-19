export const checkSufficientInventory = (
  inventoryQuantity: number,
  orderQuantity: number
): boolean => {
  if (orderQuantity === 0) {
    return false;
  }
  if (inventoryQuantity < orderQuantity) {
    return false;
  }
  return true;
};