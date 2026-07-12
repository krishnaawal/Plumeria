import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString("en-NP")}`;
}

export function createOrderId(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PLM-${yyyy}${mm}${dd}-${random}`;
}

export function clampQuantity(quantity: number, max: number) {
  if (Number.isNaN(quantity)) return 1;
  return Math.min(Math.max(1, Math.floor(quantity)), max);
}
