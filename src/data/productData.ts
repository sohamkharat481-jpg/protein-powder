import { Benefit, CartItem, CustomerReview, FaqItem, FlavorOption, Ingredient, ShowcaseAngle, UsageStep } from '../types';

export type { FlavorOption };

export const BRAND_CONFIG = {
  brandName: 'APEX LABS',
  brandLogoText: 'APEX',
  brandLogoSubtitle: 'PERFORMANCE LABS // INDIA',
  productName: 'IGNITE-X PRE-WORKOUT',
  fullProductTitle: 'APEX IGNITE-X High-Stim Pre-Workout (450g / 30 Servings)',
  currency: '₹',
  price: 2499,
  formattedPrice: '₹2,499',
  originalPrice: 3499,
  formattedOriginalPrice: '₹3,499',
  saveAmount: '₹1,000',
  costPerServing: '₹83 / workout',
  servings: '30 Clinical Servings',
  servingsCount: 30,
  netQuantity: '450g Net Wt. (15.8 oz)',
  rating: 4.94,
  reviewCount: '3,480+',
  guaranteeText: '30-Day Money-Back Guarantee',
  shippingThreshold: 1499,
  standardShippingCost: 99,
  fssaiNumber: 'FSSAI Lic. No: 10021022000845',
  supportEmail: 'support@apexnutrition.in',
  supportPhone: '+91 80 4719 2200',
  instagramHandle: '@apexlabs.in',
  warehouseLocation: 'Bhiwandi Fulfillment Hub, Mumbai & Whitefield, Bengaluru',
};

export const PRODUCT_IMAGES = {
  heroTub: '/src/assets/images/hero_product_tub_1789051339229.jpg',
  scoopShot: '/src/assets/images/scoop_powder_shot_1789051363115.jpg',
  mixedDrink: '/src/assets/images/drink_mixed_visual_1789051378447.jpg',
  altTub: '/src/assets/images/flavor_product_alt_1789051400491.jpg',
};

export const FLAVORS: FlavorOption[] = [
  {
    id: 'flavor-01',
    code: 'BLUE-RAZZ',
    name: 'Electric Blue Razz',
    flavorNotes: 'Crisp Glacier Blue Raspberry & Arctic Chill',
    accentColor: '#00e5ff',
    image: PRODUCT_IMAGES.altTub,
    inStock: true,
  },
  {
    id: 'flavor-02',
    code: 'SOUR-APPLE',
    name: 'Sour Green Apple',
    flavorNotes: 'Tart Granny Smith Bite & Sweet Citrus Finish',
    accentColor: '#ccff00',
    image: PRODUCT_IMAGES.heroTub,
    inStock: true,
  },
  {
    id: 'flavor-03',
    code: 'BLOOD-ORANGE',
    name: 'Blood Orange Mojito',
    flavorNotes: 'Zesty Nagpur Blood Orange with Crisp Mint Infusion',
    accentColor: '#ff3b30',
    image: PRODUCT_IMAGES.heroTub,
    inStock: true,
  },
];

export const BENEFITS: Benefit[] = [
  {
    id: 'benefit-energy',
    title: 'ENERGY',
    subtitle: '⚡ 350mg Dual-Stage Caffeine Matrix',
    description: 'Instant kick from anhydrous caffeine paired with Infinergy™ for smooth, sustained power with zero crash.',
    iconName: 'Zap',
    metric: 'Zero Crash',
  },
  {
    id: 'benefit-focus',
    title: 'FOCUS',
    subtitle: '🎯 1,500mg L-Tyrosine Nootropic',
    description: 'Dial in intense mind-muscle link and tunnel-vision concentration during heavy compound lifts.',
    iconName: 'Target',
    metric: 'Tunnel Vision',
  },
  {
    id: 'benefit-performance',
    title: 'PUMP',
    subtitle: '💪 8,000mg Pure Fermented Citrulline',
    description: 'Maximum nitric oxide synthesis for full muscle cell volumization, vascularity, and rapid nutrient delivery.',
    iconName: 'Activity',
    metric: 'Max Vasodilation',
  },
  {
    id: 'benefit-intensity',
    title: 'STAMINA',
    subtitle: '🔥 3,200mg CarnoSyn® Beta-Alanine',
    description: 'Buffers intramuscular lactic acid accumulation so you can push deep into high-rep hypertrophy sets.',
    iconName: 'Flame',
    metric: 'Lactic Buffer',
  },
];

export const INGREDIENTS: Ingredient[] = [
  {
    id: 'ing-1',
    name: 'L-Citrulline (100% Pure Fermented)',
    amount: '8,000 mg',
    role: 'Maximizes plasma arginine levels to stimulate massive nitric oxide production and blood flow to working musculature.',
    category: 'Endurance & Pump',
    scienceDetail: 'Pure fermented form without malate bonding to deliver 100% active free-form citrulline for deep intramuscular vascularity.',
  },
  {
    id: 'ing-2',
    name: 'Beta-Alanine (CarnoSyn® Grade)',
    amount: '3,200 mg',
    role: 'Synthesizes intramuscular carnosine to buffer hydronium ion (lactic acid) buildup during anaerobic working intervals.',
    category: 'Endurance & Pump',
    scienceDetail: 'Clinically proven dose that delays muscular fatigue and extends time to exhaustion across high-volume sets.',
  },
  {
    id: 'ing-3',
    name: 'Betaine Anhydrous (Trimethylglycine)',
    amount: '2,500 mg',
    role: 'Functions as a potent organic osmolyte to maintain cellular hydration, muscle fullness, and peak power output.',
    category: 'Performance & Power',
    scienceDetail: 'Enhances intracellular water retention, promoting cellular swelling and stimulating protein synthesis pathways.',
  },
  {
    id: 'ing-4',
    name: 'L-Tyrosine (USP Grade)',
    amount: '1,500 mg',
    role: 'Direct precursor to dopamine and norepinephrine to maintain mental sharpness under intense physical stress.',
    category: 'Focus & Nootropic',
    scienceDetail: 'Supports executive cognitive focus, preventing mental fatigue during exhausting 75+ minute training sessions.',
  },
  {
    id: 'ing-5',
    name: 'Active Caffeine Matrix (Anhydrous + Infinergy™)',
    amount: '350 mg Total',
    role: 'Biphasic release combining 275mg Caffeine Anhydrous with 75mg Di-Caffeine Malate for immediate and sustained drive.',
    category: 'Energy & Drive',
    scienceDetail: 'Buffers rapid caffeine clearance to avoid the dreaded post-workout energy drop while maintaining nervous system alertness.',
  },
  {
    id: 'ing-6',
    name: 'Pink Himalayan Rock Salt & Electrolyte Blend',
    amount: '500 mg',
    role: 'Replenishes sodium, potassium, and trace minerals lost through sweat to optimize muscle nerve impulse firing.',
    category: 'Hydration & Electrolytes',
    scienceDetail: 'Restores electrolyte osmotic gradient in working myocytes, preventing involuntary cramping and fullness loss.',
  },
  {
    id: 'ing-7',
    name: 'BioPerine® (Black Pepper Extract 95% Piperine)',
    amount: '10 mg',
    role: 'Thermogenic nutrient absorption amplifier that enhances gastrointestinal uptake of active amino acids.',
    category: 'Performance & Power',
    scienceDetail: 'Increases intestinal blood microcirculation, ensuring rapid transit of formula actives into the bloodstream.',
  },
];

export const SHOWCASE_ANGLES: ShowcaseAngle[] = [
  {
    id: 'showcase-tub',
    title: 'UV-Shield Matte Container',
    caption: 'Sealed in food-grade UV-barrier HDPE tub with nitrogen flush to preserve active ingredient potency and prevent caking.',
    image: PRODUCT_IMAGES.heroTub,
    tag: 'PACKAGING // 01',
    specLabel: 'SPECIFICATION',
    specValue: '450g Net Wt (30 Servings)',
  },
  {
    id: 'showcase-scoop',
    title: 'Calibrated Precision Scoop',
    caption: 'Heavy-gauge level scoop calibrated to deliver precisely one 15g clinical serving with zero guessing or digital scale required.',
    image: PRODUCT_IMAGES.scoopShot,
    tag: 'SERVING // 02',
    specLabel: 'PORTION',
    specValue: '1 Level Scoop (15g)',
  },
  {
    id: 'showcase-powder',
    title: 'Ultra-Micronized 200-Mesh Texture',
    caption: 'Micro-milled crystalline blend engineered for instantaneous cold-water dispersion with zero clumps, grit, or residue.',
    image: PRODUCT_IMAGES.scoopShot,
    tag: 'DISPERSION // 03',
    specLabel: 'SOLUBILITY',
    specValue: '100% Instantized Mesh',
  },
  {
    id: 'showcase-drink',
    title: 'Crisp & Thirst-Quenching Mix',
    caption: 'Formulated with refreshing natural fruit extracts. Leaves no syrupy mouthfeel or chemical aftertaste before high-exertion workouts.',
    image: PRODUCT_IMAGES.mixedDrink,
    tag: 'EXPERIENCE // 04',
    specLabel: 'DILUTION',
    specValue: '300–400 ml Chilled Water',
  },
];

export const USAGE_STEPS: UsageStep[] = [
  {
    stepNumber: '01',
    title: 'SCOOP',
    description: 'Take 1 level scoop (15g). If you are a beginner or sensitive to caffeine, start with 1/2 scoop for the first 3 sessions to assess your tolerance.',
    timing: 'Measure 1 Level Scoop',
  },
  {
    stepNumber: '02',
    title: 'MIX',
    description: 'Add powder to 300ml–400ml of chilled water in an APEX Shaker. Shake vigorously for 15–20 seconds until the solution is crystal clear.',
    timing: 'Shake for 20 Seconds',
  },
  {
    stepNumber: '03',
    title: 'TRAIN',
    description: 'Consume 20 to 30 minutes prior to training. Feel the beta-alanine tingling (paresthesia) and mental alertness activate as you warm up.',
    timing: 'Consume 20-30 Min Prior',
  },
];

export const REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    firstName: 'Arjun',
    verified: true,
    rating: 5,
    headline: 'Skin-splitting pumps and zero post-workout crash',
    reviewText: 'Hands down the cleanest pre-workout available in India. At 8,000mg pure Citrulline, the vascular fullness on push day is absurd. Unlike local brands that spike with cheap caffeine, the focus locks in around 20 mins and stays smooth without any palpitations.',
    date: 'Verified Buyer • Bengaluru • 2 days ago',
    flavorUsed: 'Electric Blue Razz',
  },
  {
    id: 'rev-2',
    firstName: 'Rohan',
    verified: true,
    rating: 5,
    headline: 'Sour Green Apple tastes incredible, mixes in 10 seconds',
    reviewText: 'I train at 6 AM in Mumbai humidity. This dissolves effortlessly with zero clumps at the bottom of the shaker. The beta-alanine tingles hit just as I finish my warmup, and the mental drive carries me through heavy squats.',
    date: 'Verified Buyer • Mumbai • 5 days ago',
    flavorUsed: 'Sour Green Apple',
  },
  {
    id: 'rev-3',
    firstName: 'Priya',
    verified: true,
    rating: 5,
    headline: 'Competitive powerlifter approved — pure transparency',
    reviewText: 'Most supplements sold in India have proprietary blends with underdosed actives. APEX openly lists every single milligram, plus the FSSAI and banned-substance testing batch reports give 100% confidence. Worth every rupee.',
    date: 'Verified Buyer • New Delhi • 1 week ago',
    flavorUsed: 'Blood Orange Mojito',
  },
  {
    id: 'rev-4',
    firstName: 'Vikram',
    verified: true,
    rating: 5,
    headline: 'Fast delivery to Hyderabad and genuine scratch verification',
    reviewText: 'Ordered on Tuesday, arrived Thursday via BlueDart Express. The QR code scratch verification on the lid verified authentic instantly. Gives great cognitive focus without stomach irritation.',
    date: 'Verified Buyer • Hyderabad • 2 weeks ago',
    flavorUsed: 'Electric Blue Razz',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is APEX IGNITE-X Pre-Workout?',
    answer: 'APEX IGNITE-X is an ultra-premium, clinical-dose pre-workout supplement formulated for serious lifters, functional fitness athletes, and endurance performers across India. It features 100% transparent active ingredients with zero proprietary blends, zero banned stimulants, and zero artificial fillers.',
  },
  {
    question: 'How should I take IGNITE-X?',
    answer: 'Mix 1 level scoop (15g) with 300ml to 400ml of cold water in a shaker bottle. Shake well for 15-20 seconds. Drink 20-30 minutes prior to your workout session. If you are new to high-stimulant pre-workouts, begin with 1/2 scoop to test your tolerance.',
  },
  {
    question: 'Is APEX IGNITE-X 100% Vegetarian and FSSAI approved?',
    answer: 'Yes. APEX IGNITE-X is 100% Vegetarian (with Green Dot certification) and manufactured in an FSSAI-licensed (Lic. No: 10021022000845), US FDA-inspected, and GMP-certified manufacturing facility. Every batch undergoes third-party HPLC testing for purity and banned substance compliance.',
  },
  {
    question: 'How many servings are in each tub?',
    answer: 'Each tub contains 450 grams net weight, providing 30 full clinical servings (15 grams per scoop). That translates to just ₹83 per workout for a full-dosed premium pre-workout formula.',
  },
  {
    question: 'How fast is shipping across India?',
    answer: 'We dispatch all orders within 24 hours from our automated hubs in Mumbai and Bengaluru. Deliveries to metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune, Kolkata) take 24 to 48 hours via BlueDart Express Air. Other regions across India take 2 to 4 business days.',
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support all major Indian payment gateways: Instant UPI (Google Pay, PhonePe, Paytm, CRED, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking (all Indian banks), and Cash on Delivery (COD).',
  },
  {
    question: 'What causes the tingling sensation after drinking it?',
    answer: 'The harmless tingling sensation (known scientifically as paresthesia) is caused by clinical-dose Beta-Alanine (3,200mg). It indicates that the compound is active in your system to buffer lactic acid accumulation. The sensation peaks in 15-20 minutes and naturally dissipates as you begin training.',
  },
  {
    question: 'How can I verify that my tub is 100% authentic?',
    answer: 'Every authentic APEX tub features a tamper-proof holographic security seal with an individual scratch-off QR code on the lid. You can scan the QR code with any smartphone camera to instantly verify batch authenticity, lab report test date, and expiry details.',
  },
];

export const LEGAL_DOCS = {
  privacyPolicy: {
    title: 'Privacy Policy',
    lastUpdated: 'February 2026',
    content: `APEX Performance Labs India Private Limited respects your privacy. We collect only necessary details (name, shipping address, contact phone number, and email) to fulfill orders and provide delivery tracking updates. We do not store full credit card or UPI MPIN credentials; all payments are processed through RBI-compliant, PCI-DSS Level 1 certified Indian payment gateways. Your personal data is never sold or rented. For privacy queries, email us at privacy@apexnutrition.in.`,
  },
  termsAndConditions: {
    title: 'Terms & Conditions',
    lastUpdated: 'February 2026',
    content: `By placing an order on apexnutrition.in, you agree to these terms. You confirm that you are at least 18 years of age. IGNITE-X is a dietary food supplement and is not intended to diagnose, treat, cure, or prevent any medical disease. FSSAI License No: 10021022000845. Always consult a certified sports nutritionist or medical practitioner prior to starting high-intensity supplementation if you have pre-existing cardiovascular or health conditions.`,
  },
  shippingPolicy: {
    title: 'Shipping & Delivery Policy',
    lastUpdated: 'February 2026',
    content: `We provide Free Express Domestic Shipping on all orders above ₹1,499 across 28,000+ Indian pincodes. Orders placed before 2:00 PM IST Monday through Saturday are dispatched on the same day via BlueDart, Delhivery, or DTDC Air. Tracking numbers and live SMS/WhatsApp dispatch alerts are sent immediately upon carrier pickup. Standard metro transit time is 24–48 hours; non-metro locations take 3–4 business days.`,
  },
  refundPolicy: {
    title: 'Return & 30-Day Money-Back Guarantee',
    lastUpdated: 'February 2026',
    content: `We stand behind IGNITE-X with an authentic 30-Day Satisfaction Guarantee. If you are not completely satisfied with the energy, focus, or flavor profile of your first container, contact support@apexnutrition.in or WhatsApp our athlete helpline within 30 days of delivery for an immediate replacement or full refund. Reverse pickup from your address is arranged at zero additional cost.`,
  },
};
