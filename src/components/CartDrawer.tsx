import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, CreditCard, QrCode, Banknote } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { BRAND_CONFIG } from '../data/productData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const isFreeShipping = subtotal >= BRAND_CONFIG.shippingThreshold;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : BRAND_CONFIG.standardShippingCost;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const progressToFreeShipping = Math.min(100, (subtotal / BRAND_CONFIG.shippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, BRAND_CONFIG.shippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    if (code === 'APEX10' || code === 'FIRST10') {
      setAppliedDiscount(0.1);
      setPromoSuccess('APEX10 applied: 10% instant discount!');
    } else if (code === 'BEAST' || code === 'POWER15') {
      setAppliedDiscount(0.15);
      setPromoSuccess('BEAST applied: 15% VIP athlete discount!');
    } else {
      setPromoError('Invalid code. Try "APEX10" or "BEAST"');
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Trigger festive confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#ffffff', '#22c55e', '#ff9900'],
      });
      onCheckoutSuccess();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-[#0e0f13] border-l border-white/10 h-full flex flex-col justify-between shadow-2xl z-10 text-white"
          >
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#ccff00]" />
                <h3 className="font-display text-2xl font-black uppercase tracking-wide">
                  YOUR BAG ({items.reduce((a, b) => a + b.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Bar */}
            <div className="bg-[#14151b] px-6 py-3 border-b border-white/5">
              <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                {isFreeShipping ? (
                  <span className="text-[#ccff00] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    UNLOCKED: FREE EXPRESS AIR SHIPPING
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Add <strong className="text-white">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for Free Shipping
                  </span>
                )}
                <span className="text-zinc-500 font-bold">{progressToFreeShipping.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#ccff00] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {items.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-zinc-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-2xl font-bold uppercase text-white mb-1">
                    YOUR BAG IS EMPTY
                  </h4>
                  <p className="text-zinc-400 text-xs font-mono-code max-w-xs">
                    Ready to elevate your training? Choose your flavor and add to cart.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[#121318] border border-white/10 flex gap-4 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-lg font-bold text-white uppercase truncate">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs font-mono-code text-[#ccff00] mt-0.5">
                        Flavor: {item.flavorName}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-white/15 bg-black/40 rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono-code font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total in INR */}
                        <div className="font-display text-lg font-bold text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer / Checkout Summary */}
            {items.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0c0d10] space-y-4">
                
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE (TRY: APEX10)"
                    className="flex-1 bg-[#15161c] border border-white/15 px-3 py-2 rounded-lg text-xs font-mono-code text-white placeholder-zinc-500 focus:outline-none focus:border-[#ccff00]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-xs font-mono-code text-white font-bold rounded-lg cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>

                {promoSuccess && (
                  <div className="text-xs font-mono-code text-[#ccff00] flex items-center justify-between">
                    <span>{promoSuccess}</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {promoError && (
                  <div className="text-xs font-mono-code text-red-400">
                    {promoError}
                  </div>
                )}

                {/* Preferred Payment Method selector */}
                <div className="pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono-code text-zinc-400 uppercase mb-2">
                    SELECT PAYMENT PREFERENCE
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono-code ${
                        paymentMethod === 'upi'
                          ? 'border-[#ccff00] bg-[#ccff00]/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span>UPI / GPay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono-code ${
                        paymentMethod === 'card'
                          ? 'border-[#ccff00] bg-[#ccff00]/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span>Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-1.5 text-xs font-mono-code ${
                        paymentMethod === 'cod'
                          ? 'border-[#ccff00] bg-[#ccff00]/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5 text-[#ccff00]" />
                      <span>Cash (COD)</span>
                    </button>
                  </div>
                </div>

                {/* Subtotal & Totals in INR */}
                <div className="space-y-1.5 text-xs font-mono-code text-zinc-400 pt-2 border-t border-white/5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-[#ccff00]">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18% Included)</span>
                    <span className="text-zinc-500">₹{Math.round((total * 18) / 118).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Air Shipping</span>
                    <span className="text-white">
                      {isFreeShipping ? 'FREE (Across India)' : `₹${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-display font-black text-white pt-2 border-t border-white/10">
                    <span>TOTAL AMOUNT</span>
                    <span className="text-[#ccff00] text-2xl font-mono-code font-bold">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  id="cart-drawer-checkout-btn"
                  className="w-full bg-[#ccff00] hover:bg-[#d9ff33] text-black font-display text-2xl font-black uppercase py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(204,255,0,0.3)] hover:shadow-[0_0_35px_rgba(204,255,0,0.45)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>CONFIRMING ORDER...</span>
                  ) : (
                    <>
                      <span>PAY ₹{total.toLocaleString('en-IN')} • PLACE ORDER</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono-code text-zinc-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>100% SECURE CHECKOUT • UPI / CARDS / NETBANKING / COD</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
