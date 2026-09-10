export interface FlavorOption {
  id: string;
  code: string; // e.g., '[FLAVOR 01]'
  name: string; // '[FLAVOR 01]' or descriptive label with placeholder
  flavorNotes: string;
  accentColor: string;
  image: string;
  inStock: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string; // e.g., '[AMOUNT 01] 8,000 mg'
  role: string;
  category: 'Endurance & Pump' | 'Performance & Power' | 'Focus & Nootropic' | 'Energy & Drive' | 'Hydration & Electrolytes';
  scienceDetail: string;
}


export interface Benefit {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: 'Zap' | 'Target' | 'Activity' | 'Flame';
  metric: string;
}

export interface ShowcaseAngle {
  id: string;
  title: string;
  caption: string;
  image: string;
  tag: string;
  specLabel: string;
  specValue: string;
}

export interface UsageStep {
  stepNumber: string;
  title: string;
  description: string;
  timing: string;
}

export interface CustomerReview {
  id: string;
  firstName: string;
  verified: boolean;
  rating: number;
  headline: string;
  reviewText: string;
  date: string;
  flavorUsed: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CartItem {
  id: string;
  productName: string;
  flavorId: string;
  flavorName: string;
  price: number;
  quantity: number;
  image: string;
}
