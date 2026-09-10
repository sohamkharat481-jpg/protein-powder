export type FlavorId = 'orange' | 'flavorless';

export interface FlavorVariant {
  id: FlavorId;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  image: string;
  accentColor: string; // '#ff7700' for orange, '#00d2ff' for flavorless
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
