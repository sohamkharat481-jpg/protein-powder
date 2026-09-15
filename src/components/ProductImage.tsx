import React, { useState } from 'react';
import { PRODUCT_IMAGES } from '../data/productData';

interface ProductImageProps {
  variant: 'orange' | 'flavorless' | 'unflavored';
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  variant,
  alt,
  className = '',
  style,
}) => {
  const isOrange = variant === 'orange';
  const primarySrc = isOrange ? PRODUCT_IMAGES.orangeTub : PRODUCT_IMAGES.flavorlessTub;
  const directPath = isOrange ? '/images/corefuel_orange.jpeg' : '/images/corefuel_unflavoured.png';
  const alternateDirectPath = isOrange ? '/images/Corefuel 3.jpeg' : '/images/corefuel_unflavoured.png';

  const [currentSrc, setCurrentSrc] = useState<string>(primarySrc);
  const [retryCount, setRetryCount] = useState<number>(0);

  React.useEffect(() => {
    setCurrentSrc(primarySrc);
    setRetryCount(0);
  }, [primarySrc, variant]);

  const handleError = () => {
    if (retryCount === 0) {
      setRetryCount(1);
      setCurrentSrc(directPath);
    } else if (retryCount === 1) {
      setRetryCount(2);
      setCurrentSrc(alternateDirectPath);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={handleError}
        className={className}
        style={style}
        loading="eager"
      />
    </div>
  );
};
