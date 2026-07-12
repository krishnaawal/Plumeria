import { CONFIRMATION_STORAGE_KEY, ORDER_STORAGE_KEY } from "@/lib/constants";
import type { CheckoutItem, OrderConfirmation } from "@/types/order";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function saveCheckoutItem(item: CheckoutItem) {
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(item));
}

export function getCheckoutItem() {
  return readJson<CheckoutItem>(ORDER_STORAGE_KEY);
}

export function clearCheckoutItem() {
  window.localStorage.removeItem(ORDER_STORAGE_KEY);
}

export function saveOrderConfirmation(confirmation: OrderConfirmation) {
  window.sessionStorage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(confirmation));
}

export function getOrderConfirmation() {
  return readJson<OrderConfirmation>(CONFIRMATION_STORAGE_KEY);
}
