export interface CustomerModel {
  id: string;
  first_name: string | null;
  last_name: string;
  email: string | null;
  phone: string;
  address: string;
  city_id: string | null;
  province_id: string | null;
  country_id: string | null;
  username: string;
  cart_id: string;
}
