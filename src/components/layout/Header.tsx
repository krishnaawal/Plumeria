"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BUSINESS } from "@/lib/constants";

const nav = [
  ["Home", "/"],
  ["Shop", "/#shop"],
  ["About", "/#about"],
  ["Plant Care", "/#care"],
  ["Reviews", "/#reviews"],
  ["Contact", "/#contact"]
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition ${
        scrolled || open ? "border-b-2 border-leaf-900 bg-petal/95 shadow-sm backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={BUSINESS.name}>
          <Image
            src="/images/logo/plumeria-logo.png"
            alt="Plumeria Plant Shop logo"
            width={173}
            height={126}
            priority
            className="h-14 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={label} href={href} className="text-sm font-semibold text-leaf-900 transition hover:text-gold">
              {label}
            </Link>
          ))}
        </div>

        <Link
          href="/#shop"
          className="hidden items-center gap-2 border-2 border-leaf-900 bg-leaf-900 px-5 py-3 text-sm font-black text-white shadow-[4px_4px_0_rgba(185,139,63,0.45)] transition hover:-translate-y-0.5 lg:inline-flex"
        >
          <ShoppingBag size={17} />
          Order Now
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center border-2 border-leaf-900 bg-petal text-leaf-900 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open ? (
        <div className="section-shell pb-6 lg:hidden">
          <div className="border-2 border-leaf-900 bg-petal p-4 shadow-[8px_8px_0_rgba(24,48,28,0.14)]">
            {nav.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-4 py-3 font-semibold text-leaf-900 hover:bg-leaf-50"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#shop"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 border-2 border-leaf-900 bg-leaf-900 px-5 py-3 font-bold text-white"
            >
              <ShoppingBag size={17} />
              Order Now
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
