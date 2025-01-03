export const ROUTES = {
  HOME: "/",
  CATEGORY: "/category",
  CATEGORY_DETAIL: "/category/:id",
  PRODUCTS: "/product",
  PRODUCT_DETAIL: "/product/:id",
  CONTACT: "/contact",
  BLOG: "/blog",
  CART: "/cart",
  PROFILE: "/profile",
  AUTHEN: "/authen",
  CHECKOUT: "/checkout",
  COMPLETE: "/complete",
  ORDER: "/order",
};

export const ADMIN_ROUTES = {
  dashboard: "/admin/dashboard",
  orders: "/admin/orders",
  sales: "/admin/sales",
  products: "/admin/products",
  inventory: {
    index: "/admin/inventory",
    products: "/admin/inventory/products",
    deleted: "/admin/inventory/deleted",
    settings: "/admin/inventory/settings",
  },
  customers: "/admin/customers",
  resources: "/admin/resources",
  settings: "/admin/settings",
  permissions: "/admin/permissions",
};
