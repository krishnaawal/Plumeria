import { Mail, MapPin, Phone, Star, Sun, Droplets, Sprout, ThermometerSun, Scissors, Flower2 } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductPurchaseSection } from "@/components/home/ProductPurchaseSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { product } from "@/data/product";
import { reviews } from "@/data/reviews";
import { BUSINESS } from "@/lib/constants";

const careItems = [
  ["Sunlight", "Place in bright direct sun for 5 to 6 hours daily.", Sun],
  ["Watering", "Water deeply, then allow the top soil to partly dry.", Droplets],
  ["Soil", "Use loose, well-draining soil for healthy roots.", Sprout],
  ["Pot drainage", "Choose a pot with drainage holes to prevent soggy soil.", Flower2],
  ["Fertilizer", "Feed lightly during warm growing months.", Sprout],
  ["Temperature", "Keep warm and protect from cold wind.", ThermometerSun],
  ["Pruning", "Prune lightly to shape after active growth.", Scissors],
  ["Flowering season", "Flowers are seasonal and can vary naturally.", Flower2]
] as const;

function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: BUSINESS.name,
      email: BUSINESS.email,
      telephone: `+977${BUSINESS.phone}`,
      address: BUSINESS.location,
      url: siteUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.shortDescription,
      image: product.images.map((image) => `${siteUrl}${image.src}`),
      offers: {
        "@type": "Offer",
        priceCurrency: "NPR",
        price: product.price,
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#shop`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BUSINESS.name,
      url: siteUrl
    }
  ];

  return (
    <Script
      id="plumeria-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <HeroSection />
        <ProductPurchaseSection />

        <section id="details" className="scroll-mt-24 bg-petal py-16 md:py-24">
          <div className="section-shell grid gap-10 border-t-2 border-leaf-900 pt-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="w-fit border-y border-leaf-900/25 py-2 text-sm font-black uppercase tracking-[0.24em] text-gold">Plant details</p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-leaf-900 md:text-5xl">
                A graceful flowering plant for warm sunny spaces
              </h2>
              <p className="mt-5 text-lg leading-8 text-leaf-700">{product.fullDescription}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Flowers", "Fragrant white blooms with a soft golden center during natural flowering periods."],
                ["Growth", "Develops woody stems and broad leaves when kept warm and sunny."],
                ["Best locations", "Balconies, terraces, entryways, patios, and garden corners with strong light."],
                ["Plant size", product.approximatePlantSize],
                ["Pot", product.potIncluded ? "Starter pot included for easy delivery and handling." : "Pot not included."],
                ["Care note", "Appearance, size, and flowering can naturally vary by season."]
              ].map(([title, text]) => (
                <div key={title} className="shop-paper border-l-4 border-leaf-900 p-5 shadow-[7px_7px_0_rgba(51,90,47,0.08)]">
                  <h3 className="font-bold text-leaf-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-leaf-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 bg-[#18301c] py-16 text-white md:py-24">
          <div className="section-shell grid items-center gap-10 lg:grid-cols-2">
            <div className="ink-border relative aspect-[4/3] overflow-hidden rounded-sm border-2 border-petal bg-white">
              <Image src="/images/about/plumeria-about.png" alt="White plumeria plant prepared by Plumeria Plant Shop" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="w-fit border-y border-white/30 py-2 text-sm font-black uppercase tracking-[0.24em] text-gold">About us</p>
              <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">Healthy White Plumeria plants with local support</h2>
              <p className="mt-5 text-lg leading-8 text-white/75">
                {BUSINESS.name} provides carefully selected White Flower Plumeria plants for homes and gardens in Nepal.
                We keep the shop simple: one beautiful plant, clear care guidance, and friendly local support from Lalitpur.
              </p>
              <div className="mt-7 grid gap-3 text-white/85">
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3"><Mail size={18} /> {BUSINESS.email}</a>
                <a href={`tel:+977${BUSINESS.phone}`} className="flex items-center gap-3"><Phone size={18} /> {BUSINESS.phone}</a>
                <span className="flex items-center gap-3"><MapPin size={18} /> {BUSINESS.location}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="care" className="scroll-mt-24 bg-petal py-16 md:py-24">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Plant care"
              title="Simple care for White Plumeria"
              description="Give the plant warmth, light, and drainage. Keep the routine simple and observe how your plant responds."
            />
            <div className="grid gap-0 overflow-hidden border-2 border-leaf-900 sm:grid-cols-2 lg:grid-cols-4">
              {careItems.map(([title, text, Icon]) => (
                <div key={title} className="shop-paper border-b border-r border-leaf-900/20 p-5">
                  <div className="grid h-11 w-11 place-items-center rounded-sm bg-leaf-900 text-white">
                    <Icon size={21} />
                  </div>
                  <h3 className="mt-4 font-bold text-leaf-900">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-leaf-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="scroll-mt-24 bg-[#eef3e7] py-16 md:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Reviews" title="What customers say" description="Sample launch reviews that can be replaced with real customer feedback later." />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {reviews.map((review) => (
                <article key={review.name} className="border-2 border-leaf-900 bg-petal p-5 shadow-[6px_6px_0_rgba(24,48,28,0.09)]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-leaf-900 font-bold text-white">{review.initials}</div>
                    <div>
                      <h3 className="font-bold text-leaf-900">{review.name}</h3>
                      <div className="flex text-gold" aria-label={`${review.rating} star rating`}>
                        {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={15} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-leaf-700">{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-petal py-16 md:py-24">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-gold">Contact</p>
              <h2 className="mt-3 font-display text-4xl text-leaf-900 md:text-5xl">Ask about your Plumeria plant</h2>
              <p className="mt-5 text-lg leading-8 text-leaf-700">Reach out for delivery timing, plant care, or local support.</p>
              <div className="mt-7 grid gap-3 text-leaf-800">
                <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3"><Mail size={18} /> {BUSINESS.email}</a>
                <a href={`tel:+977${BUSINESS.phone}`} className="flex items-center gap-3"><Phone size={18} /> {BUSINESS.phone}</a>
                <a href={BUSINESS.whatsappUrl} className="flex items-center gap-3"><Phone size={18} /> WhatsApp us</a>
                <span className="flex items-center gap-3"><MapPin size={18} /> {BUSINESS.location}</span>
              </div>
            </div>
            <form className="shop-paper grid gap-4 border-2 border-leaf-900 p-6 shadow-[10px_10px_0_rgba(51,90,47,0.08)]" aria-label="Contact form">
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className="field-label">Full name</span><input className="field" name="name" required /></label>
                <label><span className="field-label">Phone number</span><input className="field" name="phone" required /></label>
              </div>
              <label><span className="field-label">Email</span><input className="field" type="email" name="email" required /></label>
              <label><span className="field-label">Message</span><textarea className="field min-h-32" name="message" required /></label>
              <button type="submit" className="rounded-full bg-leaf-900 px-6 py-3 font-bold text-white">Send Message</button>
              <p className="text-sm text-leaf-600">This contact form is prepared as UI only. Please use phone, email, or WhatsApp for live messages.</p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
