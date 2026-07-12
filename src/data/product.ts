import type { Product } from "@/types/product";

export const DELIVERY_CHARGE = 150;
export const MAX_QUANTITY = 5;

export const product: Product = {
  id: "PLM-WHITE-001",
  slug: "white-flower-plumeria-plant",
  name: "White Flower Plumeria Plant",
  price: 500,
  originalPrice: 1200,
  discountPercentage: 41.67,
  shortDescription:
    "A healthy White Flower Plumeria plant selected for tropical elegance in homes, balconies, terraces, and gardens.",
  fullDescription:
    "White Flower Plumeria, also known as White Frangipani, is loved for its graceful branching, glossy leaves, and fragrant white flowers with a soft golden center. Each plant is naturally unique, so appearance, size, leaf count, and flowering stage can vary by season and growing conditions.",
  stockStatus: "Limited stock",
  availableQuantity: 5,
  images: [
    {
      src: "/images/product/plum.webp",
      alt: "White Flower Plumeria plant in a premium nursery pot"
    },
    {
      src: "/images/product/plum2.webp",
      alt: "Close view of white plumeria flowers and glossy leaves"
    }
  ],
  potIncluded: true,
  approximatePlantSize: "Approx. 1.5 to 2.5 ft at dispatch, naturally variable",
  deliveryInformation: "Delivery available around Lalitpur and nearby areas. We will call to confirm timing.",
  careLevel: "Beginner friendly",
  sunlightRequirement: "Bright sunlight for 5 to 6 hours daily",
  wateringRequirement: "Water deeply, then let the soil partly dry",
  highlights: [
    "Healthy White Flower Plumeria plant",
    "Beautiful fragrant white flowers",
    "Suitable for balconies, terraces, and gardens",
    "Easy to care for",
    "Carefully packed for delivery",
    "Local support available"
  ]
};
