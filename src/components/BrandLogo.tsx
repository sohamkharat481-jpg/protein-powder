import React from 'react';
import { PRODUCT_IMAGES } from '../data/productData';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'compact' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
  priority?: boolean;
}

/**
 * Official CoreFuel Brand Logo Component
 * Reference: White "CF" symbol + "COREFUEL" wordmark on black/dark background.
 * Preserves exact proportions, clear space, and avoids distortion.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
}) => {
  // Height presets designed for balanced hierarchy without being oversized
  const sizeMap = {
    xs: { h: 'h-6', symbolH: 'h-6 w-6', text: 'text-lg', sub: 'text-[9px]' },
    sm: { h: 'h-7 sm:h-8', symbolH: 'h-7 w-7 sm:h-8 sm:w-8', text: 'text-xl', sub: 'text-[10px]' },
    md: { h: 'h-8 sm:h-9', symbolH: 'h-8 w-8 sm:h-9 sm:w-9', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { h: 'h-10 sm:h-12', symbolH: 'h-10 w-10 sm:h-12 sm:w-12', text: 'text-3xl', sub: 'text-xs' },
    xl: { h: 'h-12 sm:h-16', symbolH: 'h-12 w-12 sm:h-16 sm:w-16', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // 1. Standalone Symbol Variant (White CF symbol for mobile navigation pills, badges, or compact headers)
  if (variant === 'symbol') {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${currentSize.symbolH} ${className}`}
        aria-label="CoreFuel Symbol"
      >
        <img
          src={PRODUCT_IMAGES.symbolWhite}
          alt="CoreFuel CF"
          className="w-full h-full object-contain select-none"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
    );
  }

  // 2. Compact Variant (Optimized for tight mobile headers: compact symbol + wordmark)
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 select-none ${className}`}
        aria-label="CoreFuel Logo"
      >
        <div className={`relative shrink-0 ${currentSize.symbolH}`}>
          <img
            src={PRODUCT_IMAGES.symbolWhite}
            alt="CoreFuel CF"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            loading="eager"
          />
        </div>
        <span className={`font-corefuel ${currentSize.text} tracking-tight text-white uppercase leading-none`}>
          COREFUEL
        </span>
      </div>
    );
  }

  // 3. Official Full Brand Logo (White CF symbol + COREFUEL wordmark, with guaranteed SVG aspect ratio)
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label="CoreFuel Nutrition Official Logo"
    >
      <div className={`relative shrink-0 ${currentSize.symbolH}`}>
        <img
          src={PRODUCT_IMAGES.symbolWhite}
          alt="CoreFuel CF Symbol"
          className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>
      <div className="flex flex-col justify-center">
        <span className={`font-corefuel ${currentSize.text} tracking-tight text-white uppercase leading-none`}>
          COREFUEL
        </span>
        {showSubtitle && (
          <span className={`font-micronized ${currentSize.sub} tracking-[0.25em] text-zinc-400 uppercase leading-none mt-1`}>
            NUTRITION
          </span>
        )}
      </div>
    </div>
  );
};
