"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CreditCard, Home, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DELIVERY_CHARGE, MAX_QUANTITY } from "@/lib/constants";
import { submitOrder } from "@/lib/order-service";
import { clearCheckoutItem, getCheckoutItem, saveCheckoutItem, saveOrderConfirmation } from "@/lib/storage";
import { createOrderId, formatCurrency } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormValues } from "@/lib/validations";
import type { CheckoutItem, PaymentMethod } from "@/types/order";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/Button";

export function CheckoutClient() {
  const router = useRouter();
  const [item, setItem] = useState<CheckoutItem | null>(() => getCheckoutItem());
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cash_on_delivery",
      website: ""
    }
  });

  const paymentMethod = useWatch({ control, name: "paymentMethod" });
  const subtotal = item ? item.price * item.quantity : 0;
  const total = subtotal + DELIVERY_CHARGE;

  const updateQuantity = (quantity: number) => {
    if (!item) return;
    const updated = { ...item, quantity, subtotal: item.price * quantity };
    setItem(updated);
    saveCheckoutItem(updated);
  };

  const paymentLabel = useMemo(
    () => (paymentMethod === "cash_on_delivery" ? "Cash on Delivery" : "Pay Online - Manual eSewa QR Payment"),
    [paymentMethod]
  );

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitError("");
    const currentItem = getCheckoutItem();

    if (!currentItem) {
      setSubmitError("No product has been selected.");
      return;
    }

    const now = new Date();
    const payload = {
      orderId: createOrderId(now),
      orderDate: now.toLocaleDateString("en-CA"),
      orderTime: now.toLocaleTimeString("en-NP"),
      customer: {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email.trim(),
        fullLocation: values.fullLocation.trim(),
        orderNotes: values.orderNotes?.trim()
      },
      item: {
        ...currentItem,
        subtotal: currentItem.price * currentItem.quantity
      },
      deliveryCharge: DELIVERY_CHARGE,
      totalAmount: currentItem.price * currentItem.quantity + DELIVERY_CHARGE,
      paymentMethod: values.paymentMethod as PaymentMethod,
      paymentTransactionCode: values.paymentTransactionCode?.trim(),
      orderStatus: "New" as const,
      paymentStatus: values.paymentMethod === "cash_on_delivery" ? ("Pending" as const) : ("Verification Required" as const),
      source: "Website" as const,
      createdAt: now.toISOString(),
      honeypot: values.website
    };

    const result = await submitOrder(payload);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }

    saveOrderConfirmation({
      orderId: payload.orderId,
      customerName: payload.customer.fullName,
      productName: payload.item.productName,
      quantity: payload.item.quantity,
      paymentMethod: payload.paymentMethod,
      totalAmount: payload.totalAmount
    });
    clearCheckoutItem();
    router.push("/thank-you");
  };

  if (!item) {
    return (
      <main className="min-h-screen bg-petal px-4 py-24">
        <div className="mx-auto max-w-xl rounded-lg border border-leaf-100 bg-white p-8 text-center shadow-soft">
          <AlertCircle className="mx-auto text-gold" size={38} />
          <h1 className="mt-4 font-display text-4xl text-leaf-900">No product has been selected.</h1>
          <p className="mt-3 text-leaf-700">Please return to the product section and choose your plant.</p>
          <Link href="/#shop" className="mt-6 inline-flex rounded-full bg-leaf-900 px-6 py-3 font-bold text-white">
            Return to Product
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-petal px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <Link href="/#shop" className="text-sm font-bold text-leaf-700 hover:text-gold">Back to product</Link>
        <h1 className="mt-4 font-display text-4xl text-leaf-900 md:text-5xl">Fast Checkout</h1>
        <p className="mt-2 text-leaf-700">Add your delivery details and any helpful note for the plant drop-off.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <section className="subtle-card p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-gold">Step 1</p>
                <h2 className="font-display text-3xl text-leaf-900">Delivery Details</h2>
              </div>
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-800">
                Fast order
              </span>
            </div>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Full name" error={errors.fullName?.message}><input className="field" {...register("fullName")} /></Field>
                <Field label="Phone number" error={errors.phone?.message}><input className="field" inputMode="tel" {...register("phone")} /></Field>
              </div>
              <Field label="Email address" error={errors.email?.message}><input className="field" type="email" {...register("email")} /></Field>
              <Field label="Full location" error={errors.fullLocation?.message}>
                <textarea
                  className="field min-h-20"
                  placeholder="House number, street, area, city, nearby landmark"
                  {...register("fullLocation")}
                />
              </Field>
              <Field label="Delivery notes (optional)" error={errors.orderNotes?.message}>
                <textarea
                  className="field min-h-20"
                  placeholder="Example: call before delivery, leave near gate, preferred delivery time, or anything else"
                  {...register("orderNotes")}
                />
              </Field>
              <input tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
            </div>
          </section>

          <aside className="grid gap-4 self-start">
            <section className="subtle-card p-5">
              <h2 className="font-display text-2xl text-leaf-900">Order Summary</h2>
              <div className="mt-4 flex gap-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-leaf-50">
                  <Image src={item.image.src} alt={item.image.alt} fill sizes="96px" className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-leaf-900">{item.productName}</h3>
                  <p className="text-sm text-leaf-700">Unit price: {formatCurrency(item.price)}</p>
                  <div className="mt-3"><QuantitySelector value={item.quantity} max={MAX_QUANTITY} onChange={updateQuantity} /></div>
                </div>
              </div>
              <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
              <SummaryRow label="Delivery charge" value={formatCurrency(DELIVERY_CHARGE)} />
              <SummaryRow label="Total amount" value={formatCurrency(total)} strong />
            </section>

            <section className="subtle-card p-5">
              <h2 className="font-display text-2xl text-leaf-900">Payment</h2>
              <div className="mt-4 grid gap-3">
                <PaymentOption value="cash_on_delivery" label="Cash on Delivery" icon={<Home size={18} />} register={register} />
                <PaymentOption value="esewa_qr" label="Pay Online - Manual eSewa QR Payment" icon={<CreditCard size={18} />} register={register} />
              </div>

              {paymentMethod === "cash_on_delivery" ? (
                <p className="mt-5 rounded-lg bg-leaf-50 p-4 text-sm text-leaf-800">You can pay in cash when your plant is delivered.</p>
              ) : (
                <div className="mt-5 rounded-lg border border-leaf-100 bg-white p-4">
                  <Image src="/images/esewa-qr.png" alt="eSewa QR payment placeholder" width={260} height={260} className="mx-auto rounded-md" />
                  <p className="mt-4 text-center font-bold text-leaf-900">Pay exactly {formatCurrency(total)}</p>
                  <p className="mt-3 text-sm leading-6 text-leaf-700">
                    Scan the QR code using eSewa and pay the exact order amount. After completing the payment,
                    enter your transaction or reference code below. Your payment will be manually verified before order confirmation.
                  </p>
                  <p className="mt-3 flex gap-2 rounded-md bg-cream p-3 text-sm font-semibold text-leaf-900"><ShieldCheck size={18} /> Never share your eSewa password, PIN, or OTP. We only require the transaction or reference code.</p>
                  <Field label="Transaction/reference code" error={errors.paymentTransactionCode?.message}>
                    <input className="field" {...register("paymentTransactionCode")} />
                  </Field>
                </div>
              )}
            </section>

            {submitError ? <p className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-800">{submitError}</p> : null}
            <Button type="submit" disabled={isSubmitting} className="w-full text-base disabled:cursor-not-allowed disabled:opacity-65">
              {isSubmitting ? "Placing Order..." : `Place Order - ${formatCurrency(total)}`}
            </Button>
            <p className="text-center text-sm text-leaf-600">Selected payment: {paymentLabel}</p>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`mt-4 flex items-center justify-between border-t border-leaf-100 pt-4 ${strong ? "text-xl font-black text-leaf-900" : "text-sm text-leaf-700"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function PaymentOption({
  value,
  label,
  icon,
  register
}: {
  value: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  register: ReturnType<typeof useForm<CheckoutFormValues>>["register"];
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-leaf-100 bg-white p-4 font-semibold text-leaf-900 transition hover:border-gold">
      <input type="radio" value={value} className="h-4 w-4 accent-leaf-900" {...register("paymentMethod")} />
      {icon}
      <span>{label}</span>
    </label>
  );
}
