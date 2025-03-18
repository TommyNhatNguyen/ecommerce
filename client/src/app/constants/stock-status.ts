export const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OVER_STOCK: "OVER_STOCK",
};

export const STOCK_STATUS_OPTION = [
  {
    id: STOCK_STATUS.IN_STOCK.toLowerCase(),
    value: STOCK_STATUS.IN_STOCK,
  },
  {
    id: STOCK_STATUS.OUT_OF_STOCK.toLowerCase(),
    value: STOCK_STATUS.OUT_OF_STOCK,
  },
  {
    id: STOCK_STATUS.LOW_STOCK.toLowerCase(),
    value: STOCK_STATUS.LOW_STOCK,
  },
  {
    id: STOCK_STATUS.OVER_STOCK.toLowerCase(),
    value: STOCK_STATUS.OVER_STOCK,
  },
];
