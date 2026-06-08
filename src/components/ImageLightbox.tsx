import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        animation: 'lb-fade-in 0.25s ease forwards',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center border border-[#00d4ff]/30 bg-[#111]/80 hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]/60 transition-all duration-300 z-10"
        aria-label="Close"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        <X size={16} className="text-[#00d4ff]"/>
      </button>

      {/* Image wrapper with cutting-edge border accents */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'lb-zoom-in 0.3s ease forwards' }}
      >
        {/* Top-left corner accent */}
        <div
          className="absolute -top-3 -left-3 z-20 pointer-events-none"
          style={{ width: '40px', height: '40px' }}
        >
          <div className="absolute top-0 left-0 w-8 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 10px rgba(0,212,255,0.8)' }} />
          <div className="absolute top-0 left-0 w-0.5 h-8 bg-[#00d4ff]" style={{ boxShadow: '0 0 10px rgba(0,212,255,0.8)' }} />
        </div>

        {/* Bottom-right corner accent */}
        <div
          className="absolute -bottom-3 -right-3 z-20 pointer-events-none"
          style={{ width: '40px', height: '40px' }}
        >
          <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-[#00d4ff]" style={{ boxShadow: '0 0 10px rgba(0,212,255,0.8)' }} />
          <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-[#00d4ff]" style={{ boxShadow: '0 0 10px rgba(0,212,255,0.8)' }} />
        </div>

        {/* Edge glow ring */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 30px rgba(0,212,255,0.06), 0 0 60px rgba(0,212,255,0.04)',
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
          }}
        />

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] object-contain select-none"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
            filter: 'brightness(1.05) contrast(1.02)',
          }}
        />
      </div>

      {/* Global keyframes for lightbox animations */}
      <style>{`
        @keyframes lb-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lb-zoom-in {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
