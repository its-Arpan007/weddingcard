import React, { useEffect } from 'react';
import { X, MapPin, Navigation, Calendar, Clock } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VenueModal: React.FC<VenueModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="royal-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="venue-title">
      <div
        className="royal-glass relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border-gold-ornate text-left"
        style={{
          background: 'rgba(25, 4, 10, 0.96)',
          border: '2px solid #d4af37',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.4)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full cursor-pointer transition-colors"
          style={{
            background: 'rgba(74, 14, 28, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#fdf2d0',
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span style={{ fontSize: '1.75rem' }}>🪷</span>
          <h3
            id="venue-title"
            className="font-royal text-xl sm:text-2xl mt-2 text-gold-gradient"
            style={{ letterSpacing: '0.05em' }}
          >
            Wedding Venue
          </h3>
          <p className="font-editorial italic text-sm mt-1" style={{ color: '#dcd1be' }}>
            We look forward to celebrating with you at
          </p>
        </div>

        {/* Venue Card */}
        <div
          className="p-5 rounded-xl mb-6"
          style={{
            background: 'rgba(64, 10, 24, 0.5)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-3 rounded-full mt-1"
              style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid #d4af37' }}
            >
              <MapPin size={22} style={{ color: '#f6e27a' }} />
            </div>
            <div>
              <h4 className="font-classic text-lg font-bold" style={{ color: '#fff5cc' }}>
                {WEDDING_CONFIG.venue.name}
              </h4>
              <p className="text-sm font-medium mt-1" style={{ color: '#fbf5d4' }}>
                {WEDDING_CONFIG.venue.locality}
              </p>
              <p className="text-xs mt-1" style={{ color: '#c7b6a0', lineHeight: 1.5 }}>
                {WEDDING_CONFIG.venue.fullAddress}
              </p>
            </div>
          </div>

          {/* Direct Map Button */}
          <div className="mt-4 pt-3 border-t border-gold-light/20 flex justify-end">
            <a
              href={WEDDING_CONFIG.venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal-gold text-xs py-2 px-4 inline-flex items-center gap-2"
            >
              <Navigation size={14} />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>

        {/* Event Schedule at this Venue */}
        <div className="space-y-3 mb-6">
          <h5 className="font-classic text-xs uppercase tracking-wider text-gold-solid mb-3">
            Event Schedule at Venue
          </h5>
          {WEDDING_CONFIG.events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: 'rgba(40, 7, 16, 0.6)', border: '1px solid rgba(212, 175, 55, 0.2)' }}
            >
              <div>
                <p className="font-classic font-bold text-sm" style={{ color: '#fdf2d0' }}>
                  {ev.name}
                </p>
                <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: '#bfae98' }}>
                  <Calendar size={12} />
                  <span>{ev.date} ({ev.day})</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-right" style={{ color: '#e7c265' }}>
                <Clock size={12} />
                <span>{ev.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button onClick={onClose} className="btn-royal-burgundy text-xs py-2 px-6">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
