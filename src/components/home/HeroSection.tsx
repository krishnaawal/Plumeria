"use client";

import { motion } from "framer-motion";
import { ArrowDown, MapPin, Phone, ShieldCheck, Sprout } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { BUSINESS } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="botanical-bg overflow-hidden pt-24 md:pt-28">
      <div className="section-shell grid items-center gap-8 py-10 md:gap-10 md:py-16 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 border-y border-leaf-900/25 py-2 text-xs font-black uppercase tracking-[0.24em] text-gold md:text-sm">
            <Sprout size={16} />
            One plant, grown for Nepal homes
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.02] text-leaf-900 md:mt-7 md:text-7xl">
            White Plumeria, ready for your balcony or garden.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-leaf-700 md:mt-6 md:text-lg md:leading-8">
            A simple local plant purchase: see the exact product, choose quantity, and place your order
            with cash on delivery or manual eSewa payment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8 md:gap-4">
            <LinkButton href="/#shop">See Plant & Price</LinkButton>
            <LinkButton href="/#details" variant="secondary">
              Care Details <ArrowDown size={17} />
            </LinkButton>
          </div>

          <div className="mt-7 grid gap-3 text-sm font-semibold text-leaf-800 sm:grid-cols-3">
            <span className="flex items-center gap-2 border-l-2 border-gold pl-3">
              <MapPin size={17} /> Lalitpur local support
            </span>
            <span className="flex items-center gap-2 border-l-2 border-gold pl-3">
              <ShieldCheck size={17} /> Manual confirmation
            </span>
            <a href={`tel:+977${BUSINESS.phone}`} className="flex items-center gap-2 border-l-2 border-gold pl-3">
              <Phone size={17} /> Call before buying
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative hidden md:block"
        >
          <div className="relative grid gap-4">
            <div className="absolute -right-5 top-8 z-10 rotate-3 border-2 border-leaf-900 bg-petal px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-leaf-900 shadow-lg">
              Rs. 500
            </div>
            <div className="ink-border relative aspect-[5/4] overflow-hidden rounded-sm border-2 border-leaf-900 bg-white">
              <Image
                src="/images/product/plum.webp"
                alt="White Plumeria flowers"
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 border-2 border-leaf-900 bg-petal text-center text-sm font-bold text-leaf-900">
              <span className="border-r-2 border-leaf-900 px-3 py-3">Limited stock</span>
              <span className="border-r-2 border-leaf-900 px-3 py-3">COD available</span>
              <span className="px-3 py-3">Kopundole</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
