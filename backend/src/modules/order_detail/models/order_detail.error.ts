export const ORDER_DETAIL_ERROR = new Error('Must have products');
export const ORDER_DETAIL_PRODUCT_ERROR = new Error('Product not found');
export const ORDER_DETAIL_DISCOUNT_ERROR = new Error('Discount not found');
export const ORDER_DETAIL_PRODUCT_OUT_OF_STOCK_ERROR = new Error('Product out of stock');
export const ORDER_DETAIL_MAX_DISCOUNT_COUNT_ERROR = new Error('Max discount count error');
export const ORDER_DETAIL_DISCOUNT_REQUIRE_PRODUCT_COUNT_ERROR = new Error('Require product count error');
export const ORDER_DETAIL_DISCOUNT_DATE_ERROR = new Error('Discount date error');
export const ORDER_DETAIL_DISCOUNT_REQUIRE_ORDER_AMOUNT_ERROR = new Error('Require order amount error');