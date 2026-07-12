import { z } from "zod";

const trimmedString = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} is too long.`);

export const checkoutSchema = z
  .object({
    fullName: trimmedString("Full name", 80),
    phone: z
      .string()
      .trim()
      .regex(/^(98|97)\d{8}$/, "Enter a valid Nepali mobile number."),
    email: z.string().trim().email("Enter a valid email address."),
    fullLocation: trimmedString("Full location", 260),
    orderNotes: z.string().trim().max(500, "Order notes are too long.").optional(),
    paymentMethod: z.enum(["cash_on_delivery", "esewa_qr"]),
    paymentTransactionCode: z.string().trim().max(80).optional(),
    website: z.string().max(0, "Please leave this field empty.").optional()
  })
  .superRefine((value, ctx) => {
    if (value.paymentMethod === "esewa_qr" && !value.paymentTransactionCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paymentTransactionCode"],
        message: "Transaction or reference code is required for online payment."
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
