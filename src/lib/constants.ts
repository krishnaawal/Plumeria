import { DELIVERY_CHARGE, MAX_QUANTITY, product } from "@/data/product";

export const BUSINESS = {
  name: "Plumeria Plant Shop",
  email: "unickbane@gmail.com",
  phone: "9861626549",
  location: "Kopundole, Lalitpur, Nepal",
  whatsappUrl: "https://wa.me/9779861626549"
} as const;

export const ORDER_STORAGE_KEY = "plumeria_checkout_item";
export const CONFIRMATION_STORAGE_KEY = "plumeria_order_confirmation";
export const PRODUCT_PRICE = product.price;
export { DELIVERY_CHARGE, MAX_QUANTITY };
