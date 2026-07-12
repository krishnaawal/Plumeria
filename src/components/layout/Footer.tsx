import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t-2 border-leaf-900 bg-leaf-900 py-14 pb-24 text-white md:pb-14">
      <div className="section-shell grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/images/logo/plumeria-logo.png"
            alt="Plumeria Plant Shop logo"
            width={173}
            height={126}
            className="h-20 w-auto rounded-md bg-petal/95 p-2"
          />
          <p className="mt-4 max-w-md text-white/72">
            A focused local plant shop for healthy White Flower Plumeria plants and simple care support in Nepal.
          </p>
          <div className="mt-5 flex gap-3 text-sm text-white/70">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>TikTok</span>
          </div>
        </div>
        <div>
          <p className="font-bold">Explore</p>
          <div className="mt-4 grid gap-2 text-white/75">
            <Link href="/">Home</Link>
            <Link href="/#shop">Product</Link>
            <Link href="/#about">About</Link>
            <Link href="/#care">Plant Care</Link>
            <Link href="/#reviews">Reviews</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Contact</p>
          <div className="mt-4 grid gap-2 text-white/75">
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            <a href={`tel:+977${BUSINESS.phone}`}>{BUSINESS.phone}</a>
            <span>{BUSINESS.location}</span>
            <div className="pt-3 text-sm">
              <Link href="#contact">Privacy Policy</Link>
              <span className="mx-2">/</span>
              <Link href="#contact">Terms and Conditions</Link>
            </div>
          </div>
        </div>
      </div>
      <p className="section-shell mt-10 border-t border-white/12 pt-6 text-sm text-white/55">
        Copyright {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </p>
    </footer>
  );
}
