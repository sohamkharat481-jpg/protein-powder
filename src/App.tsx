/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BenefitsSection } from './components/BenefitsSection';
import { FormulaSection } from './components/FormulaSection';
import { ProductShowcase } from './components/ProductShowcase';
import { HowToUseSection } from './components/HowToUseSection';
import { FlavorSection } from './components/FlavorSection';
import { SocialProofSection } from './components/SocialProofSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { StickyPurchaseBar } from './components/StickyPurchaseBar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutSuccessModal } from './components/CheckoutSuccessModal';
import { LegalModal } from './components/LegalModal';
import { Footer } from './components/Footer';
import { BRAND_CONFIG, FLAVORS } from './data/productData';
import { CartItem, FlavorOption } from './types';

export default function App() {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorOption>(FLAVORS[0]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'shipping' | 'refund' | null>(null);

  // Add current product selection to cart
  const handleAddToCart = (qty: number = quantity) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.flavorId === selectedFlavor.id);
      if (existing) {
        return prev.map((item) =>
          item.flavorId === selectedFlavor.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${selectedFlavor.id}-${Date.now()}`,
          productName: BRAND_CONFIG.productName,
          flavorId: selectedFlavor.id,
          flavorName: selectedFlavor.name,
          price: BRAND_CONFIG.price,
          quantity: qty,
          image: selectedFlavor.image,
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  // Immediate "Buy Now" flow: adds 1 unit of selected flavor and opens drawer
  const handleBuyNow = () => {
    handleAddToCart(1);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckoutSuccess = () => {
    const randomCode = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(randomCode);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderConfirmed(true);
  };

  const handleScrollToFormula = () => {
    const el = document.getElementById('formula');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#080809] text-[#e8e9ec] font-sans antialiased overflow-x-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Primary Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onBuyNow={handleBuyNow}
      />

      {/* Main Content Sections (Single Product Journey) */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          selectedFlavor={selectedFlavor}
          onSelectFlavor={setSelectedFlavor}
          flavors={FLAVORS}
          onBuyNow={handleBuyNow}
          onExploreFormula={handleScrollToFormula}
        />

        {/* 2. Benefits Section */}
        <BenefitsSection />

        {/* 3. Product Formula Breakdown */}
        <FormulaSection />

        {/* 4. Product Photographic Showcase */}
        <ProductShowcase selectedFlavor={selectedFlavor} />

        {/* 5. How To Use Protocol */}
        <HowToUseSection />

        {/* 6. Interactive Flavor Selector */}
        <FlavorSection
          selectedFlavor={selectedFlavor}
          onSelectFlavor={setSelectedFlavor}
          flavors={FLAVORS}
          onBuyNow={handleBuyNow}
          onAddToCart={() => handleAddToCart(1)}
        />

        {/* 7. Social Proof & Verified Reviews */}
        <SocialProofSection />

        {/* 8. Frequently Asked Questions */}
        <FaqSection />

        {/* 9. Final High-Impact CTA */}
        <FinalCtaSection
          selectedFlavor={selectedFlavor}
          onBuyNow={handleBuyNow}
        />
      </main>

      {/* 10. Sticky Purchase Bar (Appears when scrolled past hero) */}
      <StickyPurchaseBar
        selectedFlavor={selectedFlavor}
        onSelectFlavor={setSelectedFlavor}
        flavors={FLAVORS}
        quantity={quantity}
        onSetQuantity={setQuantity}
        onAddToCart={() => handleAddToCart(quantity)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 11. Footer with Legal and Support Navigation */}
      <Footer onOpenLegal={(type) => setActiveLegalModal(type)} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Order Confirmation Celebratory Modal */}
      <CheckoutSuccessModal
        isOpen={isOrderConfirmed}
        onClose={() => setIsOrderConfirmed(false)}
        orderNumber={orderNumber}
      />

      {/* Interactive Legal Policy Viewer */}
      <LegalModal
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  );
}

