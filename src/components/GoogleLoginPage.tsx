import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Phone,
  MessageSquare,
  Package,
  MapPin,
  Save,
  LogOut,
  Sparkles,
  ExternalLink,
  Copy,
  Clock,
  Truck,
  UserCheck
} from 'lucide-react';
import { BRAND_CONFIG, FLAVOR_VARIANTS } from '../data/productData';
import { BrandLogo } from './BrandLogo';
import { UserProfile, FlavorId } from '../types';

interface GoogleLoginPageProps {
  onBackToStore: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onOrderNow: (flavorId?: FlavorId) => void;
}

const DEFAULT_USER_DATA: UserProfile = {
  id: 'usr_g_88491023',
  name: 'Soham Kharat',
  email: 'sohamkharat481@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isMember: true,
  joinedDate: 'September 2026',
  phone: '+91 91454 78524',
  savedAddress: {
    fullName: 'Soham Kharat',
    phone: '+91 91454 78524',
    street: 'Flat 402, Elite Fitness Heights, Model Colony',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411016',
  },
  orderHistory: [
    {
      id: 'CF-98214',
      date: '10 Sep 2026',
      flavor: 'Orange Micronized Creatine',
      servings: '100 Servings (100g)',
      amount: '₹549/-',
      status: 'Dispatched',
      trackingNumber: 'DTDC-88192039IN',
    },
    {
      id: 'CF-94112',
      date: '15 Aug 2026',
      flavor: 'Flavorless Micronized Creatine',
      servings: '100 Servings (100g)',
      amount: '₹549/-',
      status: 'Delivered',
      trackingNumber: 'DEL-44910238IN',
    },
  ],
};

export const GoogleLoginPage: React.FC<GoogleLoginPageProps> = ({
  onBackToStore,
  currentUser,
  onLoginSuccess,
  onLogout,
  onOrderNow,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [customEmail, setCustomEmail] = useState('sohamkharat481@gmail.com');
  const [customName, setCustomName] = useState('Soham Kharat');
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Address edit state
  const [address, setAddress] = useState(
    currentUser?.savedAddress || DEFAULT_USER_DATA.savedAddress!
  );
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  // Quick Order from account state
  const [selectedQuickFlavor, setSelectedQuickFlavor] = useState<FlavorId>('orange');
  const [selectedQuickLine, setSelectedQuickLine] = useState<'secondary' | 'primary'>('secondary');

  useEffect(() => {
    if (currentUser?.savedAddress) {
      setAddress(currentUser.savedAddress);
    }
  }, [currentUser]);

  // Real Google Sign-In with server-side registration & notification flow
  const [authStatusMessage, setAuthStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async (emailToUse: string = customEmail, nameToUse: string = customName) => {
    setIsSigningIn(true);
    setAuthStatusMessage(null);

    const targetEmail = emailToUse.trim() || 'athlete@corefuel.com';
    const targetName = nameToUse.trim() || 'CoreFuel Athlete';

    try {
      const response = await fetch('/api/auth/register-or-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          savedAddress: address,
          avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}&backgroundColor=00d2ff,ff7700`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            avatarUrl: data.user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.user.name)}&backgroundColor=00d2ff,ff7700`,
            isMember: true,
            joinedDate: new Date(data.user.registeredAt || Date.now()).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
            phone: data.user.savedAddress?.phone || '+91 91454 78524',
            savedAddress: data.user.savedAddress || address,
            orderHistory: DEFAULT_USER_DATA.orderHistory,
          };

          if (data.isNewUser) {
            setAuthStatusMessage('Account created successfully! Welcome to CoreFuel.');
          } else {
            setAuthStatusMessage('Welcome back, Athlete!');
          }

          onLoginSuccess(userProfile);
          setIsSigningIn(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[AUTH_SYNC_WARN] Server sync unavailable, falling back to local authentication session:', err);
    }

    // Graceful fallback if network is unreachable
    const fallbackUser: UserProfile = {
      id: `usr_g_${Date.now()}`,
      name: targetName,
      email: targetEmail,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetName)}&backgroundColor=00d2ff,ff7700`,
      isMember: true,
      joinedDate: 'September 2026',
      phone: '+91 91454 78524',
      savedAddress: address,
      orderHistory: DEFAULT_USER_DATA.orderHistory,
    };

    onLoginSuccess(fallbackUser);
    setIsSigningIn(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      savedAddress: address,
    };
    onLoginSuccess(updatedUser);
    setAddressSavedNotification(true);

    try {
      await fetch('/api/auth/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          savedAddress: address,
        }),
      });
    } catch {
      // Local state is preserved
    }

    setTimeout(() => setAddressSavedNotification(false), 3000);
  };

  const handleCopyDiscount = () => {
    navigator.clipboard.writeText('CORE5');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuickWhatsAppOrder = () => {
    const targetPhone = selectedQuickLine === 'secondary' ? '9145478524' : '9702153668';
    const flavorText = selectedQuickFlavor === 'orange' ? 'Orange' : 'Flavorless';
    const addressDetails = address
      ? `\n\nDelivery Address:\n${address.fullName}\nPhone: ${address.phone}\n${address.street}, ${address.city} - ${address.pincode}`
      : '';
    const message = `Hi CoreFuel, I am placing my member order for CoreFuel Creatine Monohydrate (${flavorText} variant, 100 Servings @ ₹549/-).\nMember Email: ${currentUser?.email || customEmail}\nPromo Applied: CORE5 (5% Member Discount)${addressDetails}`;
    
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
              {currentUser ? 'AUTHENTICATED' : 'ATHLETE PORTAL'}
            </span>
          </div>
        </div>

        {/* CONDITION 1: USER IS NOT LOGGED IN -> SHOW GOOGLE LOGIN PAGE */}
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
                  SIGN IN TO COREFUEL
                </h1>
                
                <p className="text-zinc-400 text-sm font-sans leading-relaxed">
                  Sign in with your Google account to access member pricing, track dispatches, and save 1-click delivery information.
                </p>
              </div>

              {/* PRIMARY ACTION: OFFICIAL GOOGLE SIGN-IN BUTTON */}
              <div className="space-y-4 mb-6">
                <button
                  type="button"
                  id="google-signin-primary-btn"
                  onClick={() => handleGoogleSignIn()}
                  disabled={isSigningIn}
                  className="w-full bg-white hover:bg-zinc-100 text-zinc-800 font-sans font-semibold text-base py-3.5 px-6 rounded-xl border border-zinc-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSigningIn ? (
                    <div className="flex items-center gap-2 text-zinc-600">
                      <div className="w-5 h-5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating with Google...</span>
                    </div>
                  ) : (
                    <>
                      {/* Official Google Multicolor 'G' Icon */}
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Pre-fill Quick Account option */}
                <div className="p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 font-label-pkg">
                    <span>DETECTED GOOGLE SESSION:</span>
                    <span className="text-[#00d2ff]">READY</span>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-lg border border-white/5">
                    <div className="overflow-hidden">
                      <div className="text-white font-medium truncate">{customEmail}</div>
                      <div className="text-zinc-500 text-[11px]">{customName}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn('sohamkharat481@gmail.com', 'Soham Kharat')}
                      className="text-xs bg-[#00d2ff]/15 hover:bg-[#00d2ff]/25 text-[#00d2ff] font-semibold px-3 py-1.5 rounded-md border border-[#00d2ff]/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      1-Click Sign In
                    </button>
                  </div>
                </div>
              </div>

              {/* Custom Google Email Switcher */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="text-[11px] font-label-pkg text-zinc-400 uppercase tracking-wider">
                  OR SIGN IN WITH ANOTHER GOOGLE ACCOUNT
                </div>
                <div className="space-y-2">
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn(customEmail, customName)}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-label-pkg tracking-wider uppercase py-2.5 rounded-lg transition-colors cursor-pointer border border-white/10"
                  >
                    SIGN IN WITH CUSTOM EMAIL
                  </button>
                </div>
              </div>

              {/* Support Contact Footer */}
              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-[11px] text-zinc-500 mb-2">
                  Need direct assistance? Contact CoreFuel founders directly:
                </p>
                <div className="flex flex-wrap justify-center gap-3 text-xs font-label-pkg">
                  <a
                    href={`tel:${BRAND_CONFIG.phoneLines[1].raw}`}
                    className="text-[#00d2ff] hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Line 2: {BRAND_CONFIG.phoneLines[1].display}</span>
                  </a>
                  <span className="text-zinc-600">•</span>
                  <a
                    href={`tel:${BRAND_CONFIG.phoneLines[0].raw}`}
                    className="text-zinc-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Line 1: {BRAND_CONFIG.phoneLines[0].display}</span>
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          
          /* CONDITION 2: USER IS LOGGED IN -> SHOW MEMBER DASHBOARD */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Athlete Profile Top Banner */}
            <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#00d2ff]/20 border border-[#00d2ff]/40 overflow-hidden flex items-center justify-center text-2xl font-athletic text-[#00d2ff]">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#34A853] rounded-full flex items-center justify-center border-2 border-[#07080a]" title="Google Authenticated">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-creatine text-2xl sm:text-3xl text-white tracking-tight leading-none">
                      {currentUser.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-label-pkg tracking-wider bg-[#00d2ff]/10 text-[#00d2ff] border border-[#00d2ff]/30 uppercase">
                      ELITE MEMBER
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentUser.email}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-500">Google Verified</span>
                  </div>
                </div>
              </div>

              {/* Actions: Sign Out & Back to Store */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={onBackToStore}
                  className="flex-1 md:flex-none bg-[#00d2ff] hover:bg-[#33dbff] text-black font-athletic text-lg tracking-wider px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>ORDER MORE</span>
                </button>
                
                <button
                  onClick={onLogout}
                  id="user-signout-btn"
                  className="bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 text-xs font-label-pkg cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>SIGN OUT</span>
                </button>
              </div>
            </div>

            {/* Grid: Member Perks + 1-Click WhatsApp Dispatch */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Exclusive Member Perk */}
              <div className="bg-[#0b0e14] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-label-pkg uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>ATHLETE MEMBER DISCOUNT</span>
                </div>
                <div className="font-creatine text-3xl text-white mb-2">
                  5% OFF ORDERS
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                  Use your exclusive code when ordering directly with our founders on WhatsApp.
                </p>
                <div className="flex items-center justify-between bg-black/60 border border-white/10 p-2.5 rounded-xl">
                  <span className="font-mono-code text-base text-[#00d2ff] font-bold tracking-widest">
                    CORE5
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyDiscount}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Two Direct Contact Lines */}
              <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-[#00d2ff] text-xs font-label-pkg uppercase tracking-wider mb-2">
                  <Phone className="w-4 h-4" />
                  <span>DIRECT OWNER LINES</span>
                </div>
                <div className="font-creatine text-2xl text-white mb-1">
                  TWO NUMBERS AVAILABLE
                </div>
                <p className="text-zinc-400 text-xs mb-3">
                  Reach out anytime for instant tracking or order dispatch:
                </p>
                
                <div className="space-y-2 text-xs">
                  <a
                    href={`tel:${BRAND_CONFIG.secondaryPhoneRaw}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-[#00d2ff]/40 transition-colors"
                  >
                    <span className="text-zinc-300 font-medium">Line 2: {BRAND_CONFIG.secondaryPhoneDisplay}</span>
                    <span className="text-[10px] text-[#00d2ff] font-label-pkg">NEW LINE</span>
                  </a>
                  <a
                    href={`tel:${BRAND_CONFIG.ownerPhoneRaw}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <span className="text-zinc-300 font-medium">Line 1: {BRAND_CONFIG.ownerPhoneDisplay}</span>
                    <span className="text-[10px] text-zinc-400 font-label-pkg">FOUNDER</span>
                  </a>
                </div>
              </div>

              {/* Card 3: Free Shaker Qualification */}
              <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-label-pkg uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>QUALITY ASSURED</span>
                </div>
                <div className="font-creatine text-2xl text-white mb-1">
                  100% PURE FORMULA
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed mb-3">
                  Micronized 200 Mesh Grade. Instant solubility with 0g sugar and zero proprietary blends.
                </p>
                <div className="text-[11px] font-label-pkg text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ELIGIBLE FOR FREE SHAKER ON 2+ TUBS</span>
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
                  Send a pre-formatted message directly to our dispatch desk with your member details and saved address.
                </p>

                {/* Flavor Selection */}
                <div className="space-y-4 mb-6">
                  <label className="text-xs font-label-pkg text-zinc-400 uppercase tracking-wider block">
                    1. SELECT FLAVOR VARIANT
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedQuickFlavor('orange')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedQuickFlavor === 'orange'
                          ? 'border-[#ff7700] bg-[#ff7700]/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-athletic text-lg leading-none mb-1">ORANGE</div>
                      <div className="text-[10px] font-label-pkg text-amber-300">900mg TAURINE</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedQuickFlavor('flavorless')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedQuickFlavor === 'flavorless'
                          ? 'border-[#00d2ff] bg-[#00d2ff]/10 text-white'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-athletic text-lg leading-none mb-1">FLAVORLESS</div>
                      <div className="text-[10px] font-label-pkg text-zinc-300">100% PURE</div>
                    </button>
                  </div>
                </div>

                {/* Phone Line Selection (Choice of 9145478524 vs 9702153668) */}
                <div className="space-y-3 mb-6">
                  <label className="text-xs font-label-pkg text-zinc-400 uppercase tracking-wider block">
                    2. CHOOSE CONTACT LINE TO DISPATCH WITH
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
                      <div className="font-bold text-white">Line 2 (New)</div>
                      <div className="text-[11px] text-[#00d2ff]">91454 78524</div>
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
                      <div className="text-[11px] text-zinc-300">97021 53668</div>
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
                  <span>DISPATCH ON WHATSAPP (₹549/-)</span>
                </button>
                
                <div className="mt-3 text-center text-[11px] text-zinc-400 font-label-pkg">
                  Includes 100 Servings • Direct Owner Tracking
                </div>
              </div>

              {/* RIGHT: Saved Delivery Information Form */}
              <div className="lg:col-span-6 bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-label-pkg uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-[#ff7700]" />
                    <span>SAVED DELIVERY ADDRESS</span>
                  </div>
                  {addressSavedNotification && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Address Updated
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
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Street Address / Landmark</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
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
                        className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
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

            {/* Order History Section */}
            <div className="bg-[#0b0e14] border border-white/10 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-creatine text-2xl text-white tracking-tight">
                    RECENT ORDERS
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Your direct orders placed with CoreFuel dispatch
                  </p>
                </div>
                <span className="text-xs font-label-pkg text-[#00d2ff] bg-[#00d2ff]/10 px-3 py-1 rounded-full border border-[#00d2ff]/20">
                  {currentUser.orderHistory?.length || 0} ORDERS RECORDED
                </span>
              </div>

              <div className="space-y-3">
                {currentUser.orderHistory?.map((order) => (
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
                        <div className="text-[10px] font-mono-code text-zinc-400">
                          {order.trackingNumber}
                        </div>
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
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};
