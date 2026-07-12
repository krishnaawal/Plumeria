"use client";

import { motion } from "framer-motion";
import { Check, Clock3, MessageCircle, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { product } from "@/data/product";
import { saveCheckoutItem } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { BUSINESS } from "@/lib/constants";

export function ProductPurchaseSection() {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const router = useRouter();
  const subtotal = product.price * quantity;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => (seconds <= 1 ? 30 * 60 : seconds - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return {
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0")
    };
  }, [secondsLeft]);

  const buyNow = () => {
    saveCheckoutItem({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: selectedImage,
      subtotal
    });
    router.push("/checkout");
  };

  return (
    <section id="shop" className="scroll-mt-20 bg-[#eef3e7] py-10 md:scroll-mt-24 md:py-20">
      <div className="section-shell">
        <div className="mb-6 flex flex-col justify-between gap-4 border-y-2 border-leaf-900 py-4 md:mb-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-gold md:text-sm md:tracking-[0.24em]">
              Today at the nursery counter
            </p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-leaf-900 md:mt-3 md:text-5xl">
              Pick your White Plumeria
            </h2>
          </div>
          <a
            href={BUSINESS.whatsappUrl}
            className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-leaf-900 bg-petal px-4 py-2 text-sm font-black text-leaf-900 transition hover:-translate-y-0.5"
          >
            <MessageCircle size={17} />
            Ask before order
          </a>
        </div>

        <div className="grid items-start gap-5 md:gap-8 lg:grid-cols-[0.92fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-2 md:gap-3"
          >
            <div className="ink-border relative aspect-[4/4.25] max-h-[560px] overflow-hidden rounded-sm border-2 border-leaf-900 bg-white md:aspect-[4/5] md:max-h-[760px]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover object-center transition duration-700 hover:scale-105"
              />
              <div className="absolute left-0 top-0 bg-leaf-900 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
                Actual product photos
              </div>
            </div>
            <div className="grid max-w-sm grid-cols-2 gap-2 md:max-w-lg md:gap-3">
              {product.images.map((image) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  aria-label={`View ${image.alt}`}
                  className={`relative aspect-[5/3.2] overflow-hidden rounded-sm border-2 bg-white transition ${
                    image.src === selectedImage.src ? "border-leaf-900 shadow-[5px_5px_0_rgba(185,139,63,0.35)]" : "border-leaf-900/15"
                  }`}
                >
                  <Image src={image.src} alt={image.alt} fill sizes="30vw" className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1 }}
            className="shop-paper ink-border border-2 border-leaf-900 p-4 md:p-6 lg:-mt-5"
          >
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="border border-leaf-900 bg-leaf-100 px-2.5 py-1 text-xs font-black uppercase text-leaf-700 md:px-3 md:text-sm">
                {product.stockStatus}
              </span>
              {product.discountPercentage ? (
                <span className="border border-leaf-900 bg-gold px-2.5 py-1 text-xs font-black uppercase text-white md:px-3 md:text-sm">
                  Save {product.discountPercentage}%
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-2 border-dashed border-gold bg-[#fff4dc] p-3 md:mt-5 md:gap-4 md:p-4">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-sm bg-gold text-white md:h-11 md:w-11">
                  <Clock3 size={18} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-gold md:text-sm md:tracking-[0.18em]">
                    Hurry up, limited time left
                  </p>
                  <p className="mt-0.5 text-xs text-leaf-700 md:mt-1 md:text-sm">
                    Complete your order before this special offer ends.
                  </p>
                </div>
              </div>
              <div
                className="bg-leaf-900 px-3 py-2 text-center font-mono text-xl font-black tracking-[0.1em] text-white md:px-4 md:py-3 md:text-2xl md:tracking-[0.12em]"
                aria-label={`${countdown.minutes} minutes and ${countdown.seconds} seconds left`}
              >
                {countdown.minutes}:{countdown.seconds}
              </div>
            </div>

            <h1 className="mt-4 font-display text-3xl leading-tight text-leaf-900 md:mt-5 md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm leading-6 text-leaf-700 md:mt-3 md:text-lg md:leading-8">
              {product.shortDescription}
            </p>

            <div className="mt-4 flex items-end gap-2 border-y-2 border-leaf-900 py-3 md:mt-5 md:gap-3">
              <p className="text-3xl font-black text-leaf-900 md:text-4xl">{formatCurrency(product.price)}</p>
              {product.originalPrice ? (
                <p className="pb-1 text-base font-semibold text-leaf-500 line-through md:text-lg">
                  {formatCurrency(product.originalPrice)}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-leaf-50 p-3 md:mt-6 md:gap-5 md:p-4">
              <div>
                <p className="text-xs font-bold text-leaf-900 md:text-sm">Quantity</p>
                <p className="text-xs text-leaf-700 md:text-sm">Available: {product.availableQuantity}</p>
              </div>
              <QuantitySelector value={quantity} max={product.availableQuantity} onChange={setQuantity} />
            </div>

            <div className="mt-4 border border-leaf-900/15 bg-white p-3 md:mt-5 md:p-4">
              <div className="flex items-center justify-between text-sm text-leaf-700">
                <span>Order subtotal</span>
                <strong className="text-lg text-leaf-900 md:text-xl">{formatCurrency(subtotal)}</strong>
              </div>
            </div>

            <div className="mt-5 hidden gap-3 sm:grid sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <div key={highlight} className="flex gap-2 text-sm font-medium text-leaf-800">
                  <Check className="mt-0.5 shrink-0 text-gold" size={17} />
                  {highlight}
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 bg-cream p-3 text-xs text-leaf-800 md:mt-6 md:gap-3 md:p-4 md:text-sm">
              <Truck className="shrink-0 text-gold" size={18} />
              <span>{product.deliveryInformation}</span>
            </div>

            <Button type="button" onClick={buyNow} className="mt-4 w-full rounded-none border-2 border-leaf-900 shadow-[6px_6px_0_rgba(24,48,28,0.18)] md:mt-6">
              Buy Now
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <a
          href="#shop"
          className="flex items-center justify-between border-2 border-leaf-900 bg-leaf-900 px-4 py-3 text-white shadow-[6px_6px_0_rgba(185,139,63,0.45)]"
        >
          <span className="font-black">White Plumeria</span>
          <span className="font-black">{formatCurrency(product.price)} - Buy</span>
        </a>
      </div>
    </section>
  );
}
