"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrderConfirmation } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import type { OrderConfirmation } from "@/types/order";

export function ThankYouClient() {
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setConfirmation(getOrderConfirmation());
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center bg-petal px-4 py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-leaf-100 border-t-gold" />
      </main>
    );
  }

  if (!confirmation) {
    return (
      <main className="grid min-h-screen place-items-center bg-petal px-4 py-24">
        <div className="max-w-xl rounded-lg border border-leaf-100 bg-white p-8 text-center shadow-soft">
          <h1 className="font-display text-4xl text-leaf-900">We could not find a recent order confirmation.</h1>
          <p className="mt-4 text-leaf-700">Please return to the home page to place a new order.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-leaf-900 px-6 py-3 font-bold text-white">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-petal px-4 py-24">
      <div className="w-full max-w-2xl rounded-lg border border-leaf-100 bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto text-leaf-700" size={54} />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.24em] text-gold">Order received</p>
        <h1 className="mt-3 font-display text-4xl text-leaf-900 md:text-5xl">
          Thank you for your purchase! Your order has been received successfully.
        </h1>
        <p className="mt-4 text-lg text-leaf-700">
          We will contact you shortly to confirm your order and delivery details.
        </p>

        <dl className="mt-8 grid gap-3 rounded-lg bg-leaf-50 p-5 text-left">
          <Info label="Order ID" value={confirmation.orderId} />
          <Info label="Customer name" value={confirmation.customerName} />
          <Info label="Product" value={confirmation.productName} />
          <Info label="Quantity" value={String(confirmation.quantity)} />
          <Info label="Payment method" value={confirmation.paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Manual eSewa QR Payment"} />
          <Info label="Total amount" value={formatCurrency(confirmation.totalAmount)} />
        </dl>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/#shop" className="rounded-full bg-leaf-900 px-6 py-3 font-bold text-white">
            Order Another Plant
          </Link>
          <Link href="/" className="rounded-full border border-leaf-200 bg-white px-6 py-3 font-bold text-leaf-900">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-leaf-100 pb-3 last:border-0 last:pb-0">
      <dt className="font-semibold text-leaf-700">{label}</dt>
      <dd className="font-bold text-leaf-900">{value}</dd>
    </div>
  );
}
