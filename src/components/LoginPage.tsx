import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageSquare,
  Package,
  MapPin,
  Save,
  LogOut,
  Sparkles,
  Copy,
  AlertCircle,
  Mail,
  User,
  ArrowRight
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { BrandLogo } from './BrandLogo';
import { UserProfile, FlavorId } from '../types';

interface LoginPageProps {
  onBackToStore: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile, sessionId?: string) => void;
  onLogout: () => void;
  onOrderNow: (flavorId?: FlavorId) => void;
}

const EMPTY_ADDRESS = {
  fullName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: '',
};

export const LoginPage: React.FC<LoginPageProps> = ({
  onBackToStore,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  // Input fields start strictly empty
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Address edit state (isolated per authenticated user)
  const [address, setAddress] = useState(
    currentUser?.savedAddress || EMPTY_ADDRESS
  );
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  // Quick Order contact line selection
  const [selectedQuickLine, setSelectedQuickLine] = useState<'secondary' | 'primary'>('secondary');

  useEffect(() => {
    if (currentUser?.savedAddress) {
      setAddress(currentUser.savedAddress);
    } else {
      setAddress(EMPTY_ADDRESS);
    }
  }, [currentUser]);

  // Handle Customer Login / Registration
  const handleCustomerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address to continue.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email format (e.g., athlete@example.com).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: cleanName,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Unable to sign in. Please try again.');
      }

      if (data.sessionId) {
        localStorage.setItem('corefuel_session_id', data.sessionId);
      }

      if (data.user) {
        onLoginSuccess(data.user, data.sessionId);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const sessionId = localStorage.getItem('corefuel_session_id');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionId) {
        headers['Authorization'] = `Bearer ${sessionId}`;
      }

      const res = await fetch('/api/auth/update-address', {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          savedAddress: address,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          onLoginSuccess(data.user, sessionId || undefined);
        }
        setAddressSavedNotification(true);
        setTimeout(() => setAddressSavedNotification(false), 3000);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMessage(errData.error || 'Failed to save address');
      }
    } catch (err) {
      console.error('Failed to update address:', err);
    }
  };

  const handleCopyDiscount = () => {
    navigator.clipboard.writeText('CORE5');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuickWhatsAppOrder = () => {
    const targetPhone =
      selectedQuickLine === 'secondary'
        ? BRAND_CONFIG.secondaryPhoneRaw
        : BRAND_CONFIG.ownerPhoneRaw;

    const addressDetails = address?.fullName
      ? `\n\nDelivery Address:\n${address.fullName}\nPhone: ${address.phone}\n${address.street}, ${address.city} - ${address.pincode}`
      : '';

    const message = `Hi CoreFuel, I am placing my member order for CoreFuel Creatine Monohydrate (Orange variant, 75 Servings @ ₹549/-).\nMember: ${currentUser?.name} (${currentUser?.email})\nPromo Applied: CORE5 (5% Member Discount)${addressDetails}`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-[#e8e9ec] pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00d2ff]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#ff7700]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation & Header Bar */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10">
          <button
            onClick={onBackToStore}
            id="login-back-to-store-btn"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group cursor-pointer text-sm font-label-pkg"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#00d2ff]" />
            <span>BACK TO STORE</span>
          </button>

          <a href="#hero" onClick={onBackToStore} className="cursor-pointer">
            <BrandLogo variant="compact" size="sm" />
          </a>

          <div className="text-right">
            <span className="text-[11px] font-label-pkg text-zinc-400 uppercase tracking-widest hidden sm:inline-block">
              {currentUser ? 'AUTHENTICATED SESSION' : 'ATHLETE PORTAL'}
            </span>
          </div>
        </div>

        {/* CONDITION 1: USER IS NOT LOGGED IN -> CLEAN CUSTOMER LOGIN/SIGNUP FORM */}
        {!currentUser ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d2ff] via-[#ff7700] to-[#00d2ff]" />

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-inner">
                  <BrandLogo variant="symbol" size="sm" />
                </div>

                <h1 className="font-creatine text-3xl sm:text-4xl text-white tracking-tight uppercase leading-none mb-2">
                  Sign in to your CoreFuel account
                </h1>

                <p className="text-zinc-400 text-sm font-sans leading-relaxed">
                  Access member pricing, save your delivery address, and view dispatch history.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Clean Customer Login / Registration Form */}
              <form onSubmit={handleCustomerAuth} className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="customer-email"
                    className="text-xs font-label-pkg text-zinc-400 uppercase tracking-wider block mb-1.5"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="customer-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                      className="w-full bg-black/60 border border-white/10 focus:border-[#00d2ff] rounded-xl pl-10 pr-3.5 py-3 text-sm text-white outline-none placeholder-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="customer-name"
                    className="text-xs font-label-pkg text-zinc-400 uppercase tracking-wider block mb-1.5"
                  >
                    Full Name (for profile & dispatch)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="customer-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Alex Johnson"
                      autoComplete="name"
                      className="w-full bg-black/60 border border-white/10 focus:border-[#00d2ff] rounded-xl pl-10 pr-3.5 py-3 text-sm text-white outline-none placeholder-zinc-600 transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    First time signing in? We will automatically set up your member account.
                  </p>
                </div>

                <button
                  type="submit"
                  id="customer-login-submit-btn"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] hover:from-[#33dcff] hover:to-[#0092e6] text-black font-label-pkg font-bold tracking-wider text-sm py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed uppercase"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2 text-black">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>CONNECTING ACCOUNT...</span>
                    </div>
                  ) : (
                    <>
                      <span>SIGN IN / CONTINUE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Member Benefits List */}
              <div className="pt-5 border-t border-white/10 space-y-2.5 text-xs text-zinc-400 font-label-pkg">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#00d2ff]" />
                  <span>5% Member Discount (CORE5) auto-applied</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#ff7700]" />
                  <span>Permanent saved delivery address for 1-click orders</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct WhatsApp dispatch linked to your profile</span>
                </div>
              </div>

              {/* Support Contact Footer */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-[11px] text-zinc-500 mb-2">
                  Need direct assistance? Contact CoreFuel founders directly:
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-xs font-label-pkg">
                  <a
                    href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                    className="text-[#00d2ff] hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Line 2: {BRAND_CONFIG.secondaryPhoneDisplay}</span>
                  </a>
                  <span className="text-zinc-600">•</span>
                  <a
                    href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                    className="text-zinc-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Line 1: {BRAND_CONFIG.ownerPhoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* CONDITION 2: USER IS AUTHENTICATED -> SHOW VERIFIED PROFILE & DASHBOARD */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Top Athlete Profile Header Card */}
            <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Left: Avatar & Identity Details */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-[#00d2ff]/40 shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d2ff]/20 to-[#ff7700]/20 border border-white/20 flex items-center justify-center font-creatine text-2xl text-white">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}
                    <div
                      className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#0b0e14]"
                      title="Active Member Session"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-label-pkg text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        COREFUEL VERIFIED ATHLETE
                      </span>
                    </div>

                    <h2 className="font-creatine text-3xl sm:text-4xl text-white tracking-tight">
                      {currentUser.name}
                    </h2>

                    <p className="text-zinc-400 text-sm font-sans">
                      {currentUser.email}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono-code text-zinc-500">
                      <span>ID: CF-{currentUser.id.slice(-6).toUpperCase()}</span>
                      <span>•</span>
                      <span>MEMBER SINCE {currentUser.joinedDate?.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Sign Out button */}
                <button
                  onClick={onLogout}
                  id="logout-btn"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors text-xs font-label-pkg cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>

            {/* Quick Stats & Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Member Pricing Privilege */}
              <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-label-pkg text-[#00d2ff] uppercase tracking-wider">
                    MEMBER DISCOUNT
                  </span>
                  <span className="text-xs bg-[#00d2ff]/15 text-[#00d2ff] px-2 py-0.5 rounded font-mono-code">
                    ACTIVE
                  </span>
                </div>
                <div className="font-creatine text-3xl text-white mb-1">
                  5% OFF ORDERS
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  Promo code <span className="font-mono-code text-[#00d2ff] font-bold">CORE5</span> applied to all direct WhatsApp and call orders.
                </p>
                <button
                  type="button"
                  onClick={handleCopyDiscount}
                  className="text-xs font-label-pkg text-[#00d2ff] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCode ? 'COPIED TO CLIPBOARD!' : 'COPY CODE: CORE5'}</span>
                </button>
              </div>

              {/* Card 2: Direct Founder Lines */}
              <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-label-pkg text-amber-400 uppercase tracking-wider">
                    DIRECT DISPATCH LINES
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-creatine text-3xl text-white mb-1">
                  PRIORITY DESK
                </div>
                <div className="space-y-1 text-xs">
                  <a
                    href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                    className="flex items-center justify-between py-1 border-b border-white/5 hover:text-[#00d2ff]"
                  >
                    <span className="text-zinc-300 font-medium">Line 2: {BRAND_CONFIG.secondaryPhoneDisplay}</span>
                    <span className="text-[10px] text-zinc-400 font-label-pkg">DISPATCH</span>
                  </a>
                  <a
                    href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                    className="flex items-center justify-between py-1 hover:text-[#00d2ff]"
                  >
                    <span className="text-zinc-300 font-medium">Line 1: {BRAND_CONFIG.ownerPhoneDisplay}</span>
                    <span className="text-[10px] text-zinc-400 font-label-pkg">FOUNDER</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Quality Formula */}
              <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-label-pkg uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>QUALITY ASSURED</span>
                </div>
                <div className="font-creatine text-2xl text-white mb-1">
                  ORANGE FORMULA
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  Micronized 200 Mesh Grade with 900 mg Taurine. 75 full servings at ₹549/- ({BRAND_CONFIG.shippingNote}).
                </p>
                <div className="text-[11px] font-label-pkg text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>LAB TESTED • ZERO SUGAR</span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Dispatch Box & Saved Delivery Address */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: Quick 1-Click WhatsApp Order */}
              <div className="lg:col-span-6 bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center gap-2 text-[#00d2ff] text-xs font-label-pkg uppercase tracking-wider mb-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>INSTANT 1-CLICK ORDER</span>
                </div>

                <h3 className="font-creatine text-2xl sm:text-3xl text-white tracking-tight mb-2">
                  WHATSAPP DIRECT DISPATCH
                </h3>

                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Send a pre-formatted order message directly to our dispatch desk with your member details and saved address.
                </p>

                {/* Single Active Flavor Display */}
                <div className="mb-6 p-3 rounded-2xl bg-black/40 border border-[#ff7700]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff7700] shadow-[0_0_10px_#ff7700]" />
                    <div>
                      <div className="font-display text-base font-bold uppercase leading-none text-white">
                        Orange Formula
                      </div>
                      <div className="text-[11px] font-mono-code text-amber-300 mt-0.5">
                        900mg Taurine • 75 Full Servings
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono-code text-zinc-400">
                    {BRAND_CONFIG.priceDisplay}
                  </span>
                </div>

                {/* Phone Line Selection */}
                <div className="space-y-3 mb-6">
                  <label className="text-xs font-label-pkg text-zinc-400 uppercase tracking-wider block">
                    CHOOSE CONTACT LINE TO DISPATCH WITH
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedQuickLine('secondary')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all text-xs ${
                        selectedQuickLine === 'secondary'
                          ? 'border-[#00d2ff] bg-[#00d2ff]/15 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400'
                      }`}
                    >
                      <div className="font-bold text-white">Line 2 (Order Desk)</div>
                      <div className="text-[11px] text-[#00d2ff]">{BRAND_CONFIG.secondaryPhoneDisplay}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedQuickLine('primary')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all text-xs ${
                        selectedQuickLine === 'primary'
                          ? 'border-[#00d2ff] bg-[#00d2ff]/15 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400'
                      }`}
                    >
                      <div className="font-bold text-white">Line 1 (Founder)</div>
                      <div className="text-[11px] text-zinc-300">{BRAND_CONFIG.ownerPhoneDisplay}</div>
                    </button>
                  </div>
                </div>

                {/* Dispatch Button */}
                <button
                  type="button"
                  onClick={handleQuickWhatsAppOrder}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-athletic text-xl tracking-wider py-4 px-6 rounded-xl transition-all shadow-[0_0_25px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 cursor-pointer font-bold"
                >
                  <MessageSquare className="w-5 h-5 fill-black" />
                  <span>DISPATCH ON WHATSAPP ({BRAND_CONFIG.priceDisplay})</span>
                </button>

                <div className="mt-3 text-center text-[11px] text-zinc-400 font-label-pkg">
                  Includes 75 Servings • Direct Owner Tracking
                </div>
              </div>

              {/* RIGHT: Saved Delivery Information Form (Isolated per user) */}
              <div className="lg:col-span-6 bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-label-pkg uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#ff7700]" />
                    <span>SAVED DELIVERY ADDRESS</span>
                  </div>
                  {addressSavedNotification && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Address Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="Receiver's name"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder-zinc-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder-zinc-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Street Address / Landmark</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="House/Flat number, Street, Area"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder-zinc-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="City"
                        className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder-zinc-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="PIN code"
                        className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder-zinc-600"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white/10 hover:bg-white/15 text-white font-label-pkg tracking-wider uppercase text-xs py-3 rounded-xl border border-white/15 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE DELIVERY ADDRESS</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Order History Section (Loaded strictly per isolated user) */}
            <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-creatine text-2xl text-white tracking-tight">
                    RECENT ORDERS
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Orders linked to {currentUser.email}
                  </p>
                </div>
                <span className="text-xs font-label-pkg text-[#00d2ff] bg-[#00d2ff]/10 px-3 py-1 rounded-full border border-[#00d2ff]/20">
                  {currentUser.orderHistory?.length || 0} ORDERS RECORDED
                </span>
              </div>

              {currentUser.orderHistory && currentUser.orderHistory.length > 0 ? (
                <div className="space-y-3">
                  {currentUser.orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-zinc-300">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono-code text-xs text-zinc-400">{order.id}</span>
                            <span className="text-white font-medium text-sm">{order.flavor}</span>
                          </div>
                          <div className="text-xs text-zinc-500">
                            {order.servings} • Placed on {order.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="font-creatine text-lg text-white">{order.amount}</div>
                          {order.trackingNumber && (
                            <div className="text-[10px] font-mono-code text-zinc-400">
                              {order.trackingNumber}
                            </div>
                          )}
                        </div>

                        <span
                          className={`text-[11px] font-label-pkg px-3 py-1 rounded-full border ${
                            order.status === 'Dispatched'
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                  <Package className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-sm text-zinc-300 font-medium mb-1">
                    No previous orders recorded for this account.
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    Place your first order directly with the CoreFuel dispatch desk using WhatsApp or Call.
                  </p>
                  <button
                    type="button"
                    onClick={handleQuickWhatsAppOrder}
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold font-mono-code px-4 py-2 rounded-xl transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ORDER NOW VIA WHATSAPP</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
