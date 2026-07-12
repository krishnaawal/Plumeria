import type { ProductImage } from "./product";

export type PaymentMethod = "cash_on_delivery" | "esewa_qr";

export interface CheckoutItem {
  productId: string;
  productName: string;
  slug: string;
  price: number;
  quantity: number;
  image: ProductImage;
  subtotal: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  fullLocation: string;
  orderNotes?: string;
}

export interface OrderSubmissionPayload {
  orderId: string;
  orderDate: string;
  orderTime: string;
  customer: CustomerDetails;
  item: CheckoutItem;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentTransactionCode?: string;
  orderStatus: "New";
  paymentStatus: "Pending" | "Verification Required";
  source: "Website";
  createdAt: string;
  honeypot?: string;
}

export interface OrderSubmissionResponse {
  success: boolean;
  message: string;
  orderId?: string;
  receiptUrl?: string;
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  productName: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  totalAmount: number;
}
