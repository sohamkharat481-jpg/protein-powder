import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
  Copy,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/productData';
import { BrandLogo } from './BrandLogo';
import { UserProfile, FlavorId } from '../types';

interface GoogleLoginPageProps {
  onBackToStore: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
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

export const GoogleLoginPage: React.FC<GoogleLoginPageProps> = ({
  onBackToStore,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Clean, non-hardcoded input fields for athlete sign-in
  const [inputEmail, setInputEmail] = useState('');
  const [inputName, setInputName] = useState('');

  // Address edit state (isolated per user)
  const [address, setAddress] = useState(
    currentUser?.savedAddress || EMPTY_ADDRESS
  );
  const [addressSavedNotification, setAddressSavedNotification] = useState(false);

  // Quick Order contact line selection
  const [selectedQuickLine, setSelectedQuickLine] = useState<'secondary' | 'primary'>('secondary');

  // Google OAuth Client configuration
  const [googleClientId, setGoogleClientId] = useState<string>('');
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser?.savedAddress) {
      setAddress(currentUser.savedAddress);
    } else {
      setAddress(EMPTY_ADDRESS);
    }
  }, [currentUser]);

  // 1. Fetch Google Client configuration & setup Google Identity Services
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/config')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.googleClientId) {
          setGoogleClientId(data.googleClientId);
        }
      })
      .catch(() => {
        // config endpoint unavailable, fallback gracefully
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize Google Identity Services if client ID is present
  useEffect(() => {
    if (!googleClientId || currentUser) return;

    const win = window as any;
    if (win.google?.accounts?.id) {
      try {
        win.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          win.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            width: 320,
          });
        }
      } catch (err) {
        console.warn('[GIS_INIT_WARN]', err);
      }
    }
  }, [googleClientId, currentUser]);

  // 3. Listen for OAuth popup postMessage
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' || event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data?.user) {
          onLoginSuccess(event.data.user);
          setIsSigningIn(false);
          setErrorMessage(null);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLoginSuccess]);

  // Handle Google Token Credential verification with Server
  const handleCredentialResponse = async (response: any) => {
    setIsSigningIn(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/google/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to verify Google credentials');
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      console.error('[GIS_VERIFY_ERROR]', err);
      setErrorMessage(err.message || 'Google authentication error');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Popup-based Google OAuth Flow
  const handleGooglePopupSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Google OAuth Client ID is not configured yet');
      }
      const data = await res.json();
      if (data.url) {
        const popup = window.open(
          data.url,
          'google_oauth_popup',
          'width=600,height=700,scrollbars=yes,status=yes'
        );
        if (!popup) {
          throw new Error('Popup was blocked by browser. Please allow popups for this site.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message);
      setIsSigningIn(false);
    }
  };

  // Dynamic Multi-Athlete Sign-In (Creates or logs into distinct, isolated user accounts)
  const handleDynamicAthleteLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputEmail.trim()) {
      setErrorMessage('Please enter your Google / email address.');
      return;
    }

    setIsSigningIn(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/register-or-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inputEmail.trim(),
          name: inputName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to authenticate athlete account');
      }

      onLoginSuccess(data.user);
      setInputEmail('');
      setInputName('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const res = await fetch('/api/auth/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          savedAddress: address,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          onLoginSuccess(data.user);
        }
      }
      setAddressSavedNotification(true);
      setTimeout(() => setAddressSavedNotification(false), 3000);
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
    const targetPhone = selectedQuickLine === 'secondary' 
      ? BRAND_CONFIG.secondaryPhoneRaw 
      : BRAND_CONFIG.ownerPhoneRaw;

    const addressDetails = address?.fullName
      ? `\n\nDelivery Address:\n${address.fullName}\nPhone: ${address.phone}\n${address.street}, ${address.city} - ${address.pincode}`
      : '';

    const message = `Hi CoreFuel, I am placing my member order for CoreFuel Creatine Monohydrate (Orange variant, 75 Servings - 3 Months @ ₹549/-).\nMember: ${currentUser?.name} (${currentUser?.email})\nPromo Applied: CORE5 (5% Member Discount)${addressDetails}`;
    
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
                  Sign in with your Google account to access member pricing, save your delivery address, and view dispatch history.
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Official Google Identity Services Render Container (if available) */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div ref={googleBtnRef} className="w-full flex justify-center"></div>
              </div>

              {/* 2. Direct Google OAuth Popup Button */}
              <div className="space-y-3 mb-6">
                <button
                  type="button"
                  id="google-signin-primary-btn"
                  onClick={handleGooglePopupSignIn}
                  disabled={isSigningIn}
                  className="w-full bg-white hover:bg-zinc-100 text-zinc-800 font-sans font-semibold text-base py-3.5 px-6 rounded-xl border border-zinc-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSigningIn ? (
                    <div className="flex items-center gap-2 text-zinc-600">
                      <div className="w-5 h-5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
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
              </div>

              {/* 3. Multi-User Account Login Form */}
              <div className="pt-5 border-t border-white/10 space-y-3">
                <div className="text-[11px] font-label-pkg text-zinc-400 uppercase tracking-wider text-center">
                  OR SIGN IN WITH ATHLETE ACCOUNT
                </div>
                
                <form onSubmit={handleDynamicAthleteLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono-code text-zinc-400 mb-1">
                      GOOGLE / ATHLETE EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-zinc-400 mb-1">
                      FULL NAME (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="e.g. Alex Kumar"
                      className="w-full bg-black/50 border border-white/10 focus:border-[#00d2ff] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full bg-[#00d2ff] hover:bg-[#33dbff] text-black font-display font-black text-sm tracking-wider uppercase py-3 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.25)] disabled:opacity-50"
                  >
                    {isSigningIn ? 'AUTHENTICATING...' : 'ACCESS ATHLETE DASHBOARD'}
                  </button>
                </form>
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
                    <span className="text-xs text-zinc-500">Verified Athlete Session</span>
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

            {/* Grid: Member Perks + Contact Information */}
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
                    <span className="text-[10px] text-[#00d2ff] font-label-pkg">ORDER DESK</span>
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
                  Micronized 200 Mesh Grade with 900 mg Taurine. 75 full servings (3 Months Supply) at ₹549/- (Free Shipping).
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
                  Send a pre-formatted message directly to our dispatch desk with your member details and saved address.
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
                        900mg Taurine • 75 Full Servings (3 Mo)
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
                  Includes 75 Servings (3 Months) • Direct Owner Tracking
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

            {/* Order History Section (Loaded per user) */}
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
