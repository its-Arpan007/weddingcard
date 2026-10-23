import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Sparkles, ChevronDown, Check } from 'lucide-react';
import { WEDDING_CONFIG } from '../config/weddingData';

interface Scene4Props {
  onNextScene: () => void;
  onOpenVenue: () => void;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export const Scene4Events: React.FC<Scene4Props> = ({ onNextScene, onOpenVenue }) => {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  const [addedCalendarId, setAddedCalendarId] = useState<string | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(WEDDING_CONFIG.countdownTarget).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCalendar = (eventId: string, title: string, dateStr: string) => {
    const [day, month, year] = dateStr.split(' ');
    const monthNum = month === 'November' ? '11' : '11';
    const startDate = `${year}${monthNum}${day.padStart(2, '0')}T180000`;
    const endDate = `${year}${monthNum}${day.padStart(2, '0')}T230000`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Sneha & Dipak Wedding - ${title}`
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      `Wedding celebration of Sneha and Dipak at Sethjees Banquet, Maniktala, Kanchrapara.`
    )}&location=${encodeURIComponent(WEDDING_CONFIG.venue.fullAddress)}`;

    window.open(gcalUrl, '_blank');
    setAddedCalendarId(eventId);
    setTimeout(() => setAddedCalendarId(null), 3000);
  };

  return (
    <section id="scene-4" className="scene-container" aria-label="Scene 4: Wedding Events and Live Countdown">
      {/* Background: Palace garden with mandaps and water reflections */}
      <div
        className="scene-bg-layer"
        style={{
          backgroundImage: `url('/assets/scene4_event_garden.jpg')`,
        }}
      />
      <div className="scene-overlay-gradient" />

      {/* Main Content */}
      <div className="scene-content">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-2 max-w-lg mx-auto px-4">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full mb-1"
            style={{
              background: 'rgba(74, 14, 28, 0.75)',
              border: '1px solid rgba(212, 175, 55, 0.55)',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)',
            }}
          >
            <Sparkles size={12} style={{ color: '#f6e27a' }} />
            <span className="font-classic text-[11px] tracking-widest uppercase text-gold-solid">
              Three Sacred Ceremonies
            </span>
            <Sparkles size={12} style={{ color: '#f6e27a' }} />
          </div>
          <h2 className="font-royal text-xl sm:text-2xl text-gold-gradient tracking-wide">
            Wedding Celebrations
          </h2>
          <p className="font-editorial italic text-xs mt-0.5 max-w-md mx-auto" style={{ color: '#fbf5d4' }}>
            We request the honor of your presence and warm blessings at each auspicious moment
          </p>
        </div>

        {/* The 3 Event Cards (Tikal, Matkor, Shhadi) — Ivory Medallion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full max-w-5xl mb-3">
          {WEDDING_CONFIG.events.map((event, index) => (
            <div
              key={event.id}
              className="event-card text-center flex flex-col justify-between"
            >
              <div className="event-card-inner-border">
                {/* Circular Number Badge matching reference */}
                <div className="event-number-badge">
                  0{index + 1}
                </div>

                {/* Event Name in Script Calligraphy */}
                <h3 className="font-calligraphy text-4xl sm:text-5xl my-1 leading-tight" style={{ color: '#781229' }}>
                  {event.name}
                </h3>
                <p className="font-classic text-[10px] tracking-widest uppercase font-bold text-gold-deep mb-2">
                  {event.badge}
                </p>

                {/* Event Meta List with Icons */}
                <div className="space-y-1.5 py-2.5 my-2 border-t border-b border-gold-deep/20 text-xs text-left px-2">
                  <div className="flex items-center gap-2" style={{ color: '#3a0612' }}>
                    <Calendar size={13} style={{ color: '#781229', flexShrink: 0 }} />
                    <span className="font-classic font-bold text-[11px]">{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2" style={{ color: '#5a3d12' }}>
                    <Clock size={13} style={{ color: '#781229', flexShrink: 0 }} />
                    <span className="text-[11px] font-medium">{event.day} • {event.time}</span>
                  </div>

                  <div className="flex items-start gap-2" style={{ color: '#3a0612' }}>
                    <MapPin size={13} style={{ color: '#781229', flexShrink: 0 }} className="mt-0.5" />
                    <span className="text-[11px] leading-tight font-medium">{event.venue}</span>
                  </div>
                </div>

                {/* Event Actions with Circular Button */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => handleAddToCalendar(event.id, event.name, event.date)}
                    className="event-circle-btn"
                    title="Add to Google Calendar"
                    aria-label={`Add ${event.name} to calendar`}
                  >
                    {addedCalendarId === event.id ? <Check size={16} /> : <span style={{ fontSize: '18px', lineHeight: 1 }}>→</span>}
                  </button>
                  <button
                    onClick={onOpenVenue}
                    className="text-[10px] font-classic uppercase tracking-wider font-bold py-1 px-3.5 rounded-full cursor-pointer hover:bg-gold-light transition-colors"
                    style={{ background: 'rgba(120, 18, 41, 0.08)', border: '1px solid #c49a2a', color: '#590c1e' }}
                  >
                    Venue Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Countdown Clock to 29 November 2026 — Ornate Plaque */}
        <div className="countdown-ornate-plaque text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span style={{ fontSize: '1.15rem' }}>⏳</span>
            <h3 className="font-royal text-sm sm:text-lg text-gold-gradient tracking-widest uppercase">
              Countdown to the Wedding
            </h3>
            <span style={{ fontSize: '1.15rem' }}>⏳</span>
          </div>

          {!countdown.isComplete ? (
            <>
              <p className="font-editorial italic text-xs mb-3 text-gold-light/90">
                Sunday, {WEDDING_CONFIG.weddingDate} • {WEDDING_CONFIG.venue.name}
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <div className="countdown-box">
                  <span className="font-royal text-2xl sm:text-3xl font-bold text-gold-gradient block">
                    {String(countdown.days).padStart(2, '0')}
                  </span>
                  <span className="font-classic text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-solid block mt-0.5">
                    Days
                  </span>
                </div>

                <span className="text-xl font-bold text-gold-bright">:</span>

                <div className="countdown-box">
                  <span className="font-royal text-2xl sm:text-3xl font-bold text-gold-gradient block">
                    {String(countdown.hours).padStart(2, '0')}
                  </span>
                  <span className="font-classic text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-solid block mt-0.5">
                    Hours
                  </span>
                </div>

                <span className="text-xl font-bold text-gold-bright">:</span>

                <div className="countdown-box">
                  <span className="font-royal text-2xl sm:text-3xl font-bold text-gold-gradient block">
                    {String(countdown.minutes).padStart(2, '0')}
                  </span>
                  <span className="font-classic text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-solid block mt-0.5">
                    Minutes
                  </span>
                </div>

                <span className="text-xl font-bold text-gold-bright">:</span>

                <div className="countdown-box">
                  <span className="font-royal text-2xl sm:text-3xl font-bold text-gold-gradient block">
                    {String(countdown.seconds).padStart(2, '0')}
                  </span>
                  <span className="font-classic text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-solid block mt-0.5">
                    Seconds
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="py-2">
              <h4 className="font-royal text-xl text-gold-gradient mb-1">
                Today is the Auspicious Day!
              </h4>
              <p className="font-editorial italic text-xs" style={{ color: '#fbf5d4' }}>
                The wedding ceremony of Sneha & Dipak is taking place today at Sethjees Banquet.
              </p>
            </div>
          )}
        </div>

        {/* Scroll hint to Scene 5 */}
        <div className="scroll-hint mt-3" onClick={onNextScene} role="button" tabIndex={0} style={{ marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem' }}>Scroll to Meet the Families</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </section>
  );
};
