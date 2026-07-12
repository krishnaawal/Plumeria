export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  shortDescription: string;
  fullDescription: string;
  stockStatus: "In stock" | "Out of stock" | "Limited stock";
  availableQuantity: number;
  images: ProductImage[];
  potIncluded: boolean;
  approximatePlantSize: string;
  deliveryInformation: string;
  careLevel: string;
  sunlightRequirement: string;
  wateringRequirement: string;
  highlights: string[];
}
