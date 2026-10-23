import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WEDDING_CONFIG } from '../config/weddingData';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose }) => {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState('yes');
  const [guestCount, setGuestCount] = useState('2');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Festive Flower / Gold Confetti Shower
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e7c265', '#d4af37', '#e05666', '#f19066', '#fff5cc'],
      });
    } catch {
      // fallback
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setGuestName('');
    setMessage('');
    onClose();
  };

  return (
    <div className="royal-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
      <div
        className="royal-glass relative w-full max-w-md p-6 sm:p-8 rounded-2xl border-gold-ornate text-left"
        style={{
          background: 'rgba(25, 4, 10, 0.96)',
          border: '2px solid #d4af37',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212, 175, 55, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
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

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <span style={{ fontSize: '1.75rem' }}>💌</span>
              <h3 id="rsvp-title" className="font-royal text-xl sm:text-2xl mt-1 text-gold-gradient">
                RSVP & Blessings
              </h3>
              <p className="font-editorial italic text-xs mt-1" style={{ color: '#dcd1be' }}>
                Join us in celebrating the union of {WEDDING_CONFIG.couple.brideFirstName} & {WEDDING_CONFIG.couple.groomFirstName}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-classic uppercase tracking-wider mb-1" style={{ color: '#f6e27a' }}>
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Anand Sharma & Family"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm"
                  style={{
                    background: 'rgba(50, 8, 20, 0.7)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#fff5cc',
                    outline: 'none',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-classic uppercase tracking-wider mb-1" style={{ color: '#f6e27a' }}>
                    Will you attend?
                  </label>
                  <select
                    value={attending}
                    onChange={(e) => setAttending(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-xs"
                    style={{
                      background: 'rgba(50, 8, 20, 0.7)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#fff5cc',
                      outline: 'none',
                    }}
                  >
                    <option value="yes">Joyfully Attending</option>
                    <option value="no">Wishing from Afar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-classic uppercase tracking-wider mb-1" style={{ color: '#f6e27a' }}>
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{
                      background: 'rgba(50, 8, 20, 0.7)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#fff5cc',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-classic uppercase tracking-wider mb-1" style={{ color: '#f6e27a' }}>
                  Blessings & Wishes
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your heartfelt wishes for Sneha & Dipak..."
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm"
                  style={{
                    background: 'rgba(50, 8, 20, 0.7)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    color: '#fff5cc',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-royal-gold w-full text-xs py-3 flex justify-center items-center gap-2">
                  <Send size={14} />
                  <span>Send Blessings</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex p-3 rounded-full mb-3" style={{ background: 'rgba(212, 175, 55, 0.15)' }}>
              <CheckCircle2 size={36} style={{ color: '#f6e27a' }} />
            </div>
            <h4 className="font-royal text-xl text-gold-gradient mb-2">
              Dhanyavaad, {guestName}!
            </h4>
            <p className="font-editorial italic text-sm mb-4" style={{ color: '#fbf5d4', lineHeight: 1.6 }}>
              Your warm wishes and blessings have been received with deep gratitude. We eagerly await to celebrate this auspicious day with you!
            </p>
            <div className="p-3 rounded-lg mb-5" style={{ background: 'rgba(74, 14, 28, 0.5)', border: '1px dashed #d4af37' }}>
              <p className="text-xs" style={{ color: '#e7c265' }}>
                Event Date: 29 November 2026 • Sethjees Banquet
              </p>
            </div>
            <button onClick={handleReset} className="btn-royal-burgundy text-xs py-2 px-6">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
