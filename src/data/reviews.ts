export interface Review {
  name: string;
  initials: string;
  rating: number;
  text: string;
}

// Sample reviews for launch. Replace with real customer reviews when available.
export const reviews: Review[] = [
  {
    name: "Anisha Shrestha",
    initials: "AS",
    rating: 5,
    text: "The plant arrived fresh and carefully packed. It is already looking beautiful on our terrace."
  },
  {
    name: "Rabin Maharjan",
    initials: "RM",
    rating: 5,
    text: "Very helpful guidance after delivery. The plumeria is healthy and easy to maintain."
  },
  {
    name: "Pratiksha K.C.",
    initials: "PK",
    rating: 4,
    text: "Loved the clean packaging and clear care tips. The plant size was just right for my balcony."
  },
  {
    name: "Suman Lama",
    initials: "SL",
    rating: 5,
    text: "Good local service in Lalitpur and a lovely white plumeria plant for the garden."
  }
];
