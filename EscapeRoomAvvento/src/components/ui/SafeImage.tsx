import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { resolveAsset } from '../../utils/resolveAsset';

export interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  draggable?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  draggable = false,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  const resolvedSrc = resolveAsset(src);

  useEffect(() => {
    setFailed(false);
  }, [resolvedSrc]);

  if (failed || !resolvedSrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-[#0F172A] border-2 border-dashed border-amber-400/80 text-amber-100 p-3 text-center select-none ${className} ${fallbackClassName}`}
      >
        <ImageOff className="w-8 h-8 text-amber-300 shrink-0" />
        <span className="text-base md:text-lg font-bold leading-snug break-words max-w-full">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      draggable={draggable}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
