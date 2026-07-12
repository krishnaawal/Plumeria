import type { Metadata } from "next";
import { ThankYouClient } from "@/components/thank-you/ThankYouClient";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Your White Flower Plumeria Plant order confirmation.",
  alternates: {
    canonical: "/thank-you"
  }
};

export default function ThankYouPage() {
  return <ThankYouClient />;
}
