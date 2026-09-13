export type FlavorId = 'orange' | 'unflavored' | 'Unflavored';

export interface FlavorVariant {
  id: FlavorId;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  image: string;
  accentColor: string; // '#ff7700' for orange, '#00d2ff' for Unflavored
  themeClass: string;
  servings: string;
  servingCount: number;
  highlightText: string;
  bestFor: string;
  mixGuidance: string;
  price: number;
  formattedPrice: string;
  originalPrice: number;
  formattedOriginalPrice: string;
  inStock: boolean;
}

export interface Benefit {
  step: string;
  title: string;
  description: string;
}

export interface UsageStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isMember: boolean;
  joinedDate: string;
  phone?: string;
  savedAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderHistory?: {
    id: string;
    date: string;
    flavor: string;
    servings: string;
    amount: string;
    status: 'Confirmed' | 'Dispatched' | 'Delivered';
    trackingNumber?: string;
  }[];
}
