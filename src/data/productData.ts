import { Benefit, FaqItem, FlavorVariant, UsageStep } from '../types';

// Direct ES Module imports for guaranteed production bundling in Vite & Vercel
import orangeTubImg from '../assets/images/corefuel_creatine_tub_1789060180499.jpg';
import flavorlessTubImg from '../assets/images/corefuel_flavorless_tub_1789060523404.jpg';
import heroBannerDuoImg from '../assets/images/corefuel_hero_banner_1789060898239.jpg';
import duoShowcaseImg from '../assets/images/corefuel_duo_showcase_1789060920236.jpg';
import cinematicGymDuoImg from '../assets/images/corefuel_cinematic_gym_1789060942971.jpg';
import gymAthleteImg from '../assets/images/corefuel_gym_athlete_1789060195318.jpg';
import orangeScoopImg from '../assets/images/corefuel_orange_scoop_1789060208528.jpg';

export const PRODUCT_IMAGES = {
  orangeTub: orangeTubImg || '/images/corefuel_creatine_tub_1789060180499.jpg',
  flavorlessTub: flavorlessTubImg || '/images/corefuel_flavorless_tub_1789060523404.jpg',
  heroBannerDuo: heroBannerDuoImg || '/images/corefuel_hero_banner_1789060898239.jpg',
  duoShowcase: duoShowcaseImg || '/images/corefuel_duo_showcase_1789060920236.jpg',
  cinematicGymDuo: cinematicGymDuoImg || '/images/corefuel_cinematic_gym_1789060942971.jpg',
  gymAthlete: gymAthleteImg || '/images/corefuel_gym_athlete_1789060195318.jpg',
  orangeScoop: orangeScoopImg || '/images/corefuel_orange_scoop_1789060208528.jpg',
};

export const BRAND_CONFIG = {
  brandName: 'CoreFuel Nutrition',
  shortBrandName: 'CoreFuel',
  productName: 'CoreFuel Creatine Monohydrate',
  productSubtype: 'Micronized',
  headline: 'POWER EVERY REP.',
  subheadline: 'Micronized Creatine Monohydrate built for your daily training.',
  brandTagline: 'Fuel your consistency.',
  servings: '100 Servings',
  servingCount: 100,
  
  // Exact Pricing as specified
  priceNumeric: 549,
  priceDisplay: '₹549/-',
  shippingNote: '+ shipping charges',
  
  // Direct Owner Contact Information
  ownerPhoneDisplay: '+91 97021 53668',
  ownerPhoneRaw: '+919702153668',
  ownerPhoneNumericOnly: '919702153668',
  instagramHandle: '@corefuel_nutrition_official',
  instagramUrl: 'https://www.instagram.com/corefuel_nutrition_official?stkn=MTFxaGJrNGxhNGwxYQ==',
  
  generateWhatsAppLink: (flavorName: string) => {
    const text = `Hi CoreFuel, I want to order CoreFuel Creatine Monohydrate. My preferred flavor is ${flavorName}.`;
    return `https://wa.me/919702153668?text=${encodeURIComponent(text)}`;
  },
};

export const FLAVOR_VARIANTS: Record<'orange' | 'flavorless', FlavorVariant> = {
  orange: {
    id: 'orange',
    name: 'Orange',
    tagline: 'Bold orange flavor for a refreshing creatine routine.',
    badge: 'REFRESHING CITRUS',
    description: 'Crisp, thirst-quenching citrus profile designed to break the monotony of unflavored powders. Formulated with 900 mg L-Taurine for daily training.',
    image: PRODUCT_IMAGES.orangeTub,
    accentColor: '#ff7700',
    themeClass: 'text-[#ff7700] border-[#ff7700]',
    servings: '100 Servings',
    servingCount: 100,
    highlightText: '900 mg L-Taurine',
    bestFor: 'Refreshing standalone drink with cold water or ice',
    mixGuidance: 'Mix 1 scoop with 250–300ml cold water.',
    price: 549,
    formattedPrice: '₹549/-',
    originalPrice: 799,
    formattedOriginalPrice: '₹799/-',
    inStock: true,
  },
  flavorless: {
    id: 'flavorless',
    name: 'Flavorless',
    tagline: 'Simple and versatile for your preferred drink or shake.',
    badge: '100% UNFLAVORED',
    description: 'Pure micronized creatine monohydrate with zero added flavorings or sweeteners. Blends seamlessly into whey protein, smoothies, juice, or water.',
    image: PRODUCT_IMAGES.flavorlessTub,
    accentColor: '#00d2ff',
    themeClass: 'text-[#00d2ff] border-[#00d2ff]',
    servings: '100 Servings',
    servingCount: 100,
    highlightText: 'Zero Flavorings • Pure Micronized',
    bestFor: 'Versatile daily stacking with your protein shake or pre-workout',
    mixGuidance: 'Add 1 scoop to your protein shake, juice, or favorite beverage.',
    price: 549,
    formattedPrice: '₹549/-',
    originalPrice: 799,
    formattedOriginalPrice: '₹799/-',
    inStock: true,
  },
};

export const PRODUCT_INFO_GRID = [
  {
    kicker: 'MICRONIZED',
    label: 'CREATINE',
    subtext: 'Ultra-fine 200-mesh powder for easy mixing',
  },
  {
    kicker: '100',
    label: 'SERVINGS',
    subtext: 'Built for over 3 months of daily training',
  },
  {
    kicker: '2',
    label: 'FLAVORS',
    subtext: 'Refreshing Orange or pure Flavorless',
  },
  {
    kicker: 'DAILY',
    label: 'TRAINING',
    subtext: 'Engineered for people who show up every day',
  },
];

export const BENEFITS: Benefit[] = [
  {
    step: '01',
    title: 'STRENGTH SUPPORT',
    description: 'Formulated to complement progressive resistance training and heavy compound lifts.',
  },
  {
    step: '02',
    title: 'PERFORMANCE SUPPORT',
    description: 'Designed to support high-intensity workout efforts across demanding training sessions.',
  },
  {
    step: '03',
    title: 'RECOVERY SUPPORT',
    description: 'Replenishes cellular energy reserves to keep you ready for subsequent workout days.',
  },
  {
    step: '04',
    title: 'TRAINING CONSISTENCY',
    description: 'A seamless, dependable addition to your everyday nutrition and training regimen.',
  },
];

export const ROUTINE_STEPS: UsageStep[] = [
  {
    stepNumber: '01',
    title: 'SCOOP',
    description: 'Follow the serving size specified on the product packaging.',
  },
  {
    stepNumber: '02',
    title: 'MIX',
    description: 'Mix with your preferred beverage.',
  },
  {
    stepNumber: '03',
    title: 'TRAIN',
    description: 'Make it part of your consistent training routine.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is creatine monohydrate?',
    answer: 'Creatine monohydrate is a thoroughly studied sports nutrition ingredient that aids in replenishing cellular ATP (adenosine triphosphate). It supports muscular power, explosive performance, and intracellular hydration during resistance exercise.',
  },
  {
    question: 'What is the difference between Orange and Flavorless?',
    answer: 'Both provide pure micronized creatine monohydrate with 100 full servings. The Orange variant has a crisp, thirst-quenching citrus profile and 900 mg L-Taurine as shown on the packaging. The Flavorless variant contains zero sweeteners or flavorings, making it versatile to blend invisibly into your protein shake or smoothie.',
  },
  {
    question: 'How do I use CoreFuel Creatine?',
    answer: 'Mix 1 serving (approx. 3g–5g as indicated on the package) with 250–300ml of cold water or your favorite beverage. Consume daily as part of your consistent training routine and maintain generous daily hydration.',
  },
  {
    question: 'How many servings are included?',
    answer: 'Every container of CoreFuel Creatine Monohydrate contains 100 full servings, designed to support your daily training over a multi-month cycle.',
  },
  {
    question: 'Can Flavorless be mixed with other drinks?',
    answer: 'Yes. The Flavorless variant is specifically unflavored and micronized to dissolve smoothly into whey protein shakes, juices, pre-workouts, or water without altering taste or sweetness.',
  },
  {
    question: 'How should I store the product?',
    answer: 'Store the container in a cool, dry place away from direct sunlight, excessive heat, and humidity. Ensure the screw-on lid is tightly sealed after every scoop.',
  },
];
