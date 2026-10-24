/**
 * Calendar Utilities — Save the Date Engine
 * Supports Google Calendar URL creation and RFC 5545 iCalendar (.ics) generation
 * Timezone: Asia/Kolkata (+05:30)
 */

/**
 * Escape text according to RFC 5545 (Section 3.3.11)
 * @param {string} str
 * @returns {string}
 */
function escapeIcsText(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Format Date string YYYY-MM-DD into YYYYMMDD
 * @param {string} dateISO - e.g. '2026-11-27'
 * @returns {string} e.g. '20261127'
 */
function toIcsDateOnly(dateISO) {
  return dateISO.replace(/-/g, '');
}

/**
 * Get next day date ISO string for exclusive all-day end dates
 * @param {string} dateISO - '2026-11-27'
 * @returns {string} '20261128'
 */
function getNextDayIcsDate(dateISO) {
  const [year, month, day] = dateISO.split('-').map(Number);
  const nextDate = new Date(year, month - 1, day + 1);
  const y = nextDate.getFullYear();
  const m = String(nextDate.getMonth() + 1).padStart(2, '0');
  const d = String(nextDate.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

/**
 * Generate pre-filled Google Calendar URL
 * @param {Object} event
 * @returns {string}
 */
export function getGoogleCalendarUrl(event) {
  const title = `Sneha & Dipak Wedding — ${event.name} Ceremony`;
  
  let datesParam = '';
  if (event.time && event.time.start && event.time.end) {
    const d = toIcsDateOnly(event.dateISO);
    const startHourMin = event.time.start.replace(':', '') + '00';
    const endHourMin = event.time.end.replace(':', '') + '00';
    datesParam = `${d}T${startHourMin}/${d}T${endHourMin}`;
  } else {
    // All-day event: start date to next day date
    const dStart = toIcsDateOnly(event.dateISO);
    const dEnd = getNextDayIcsDate(event.dateISO);
    datesParam = `${dStart}/${dEnd}`;
  }

  const details = [
    `You are cordially invited to celebrate the royal wedding ceremony: ${event.name}.`,
    `Couple: Sneha Sinha & Dipak Prasad`,
    `Ritual: ${event.badge}`,
    event.time ? `Time: ${event.time.display}` : null,
    `Venue: ${event.venue}`,
    event.mapUrl ? `Google Maps: ${event.mapUrl}` : null,
  ].filter(Boolean).join('\n\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: details,
    location: event.venueAddress || event.venue,
    ctz: 'Asia/Kolkata',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate RFC 5545 compliant .ics file content
 * @param {Object} event
 * @returns {string}
 */
export function generateIcsContent(event) {
  const uid = `${event.id}-202611-snehadipak@weddingcard.vercel.app`;
  const dtstamp = '20261024T120000Z';
  const summary = escapeIcsText(`Sneha & Dipak Wedding — ${event.name}`);
  const location = escapeIcsText(event.venueAddress || event.venue);
  
  const descriptionLines = [
    `Sneha Sinha & Dipak Prasad Wedding Celebration`,
    `Ceremony: ${event.name} (${event.badge})`,
    event.time ? `Time: ${event.time.display}` : `Date: ${event.date}`,
    `Venue: ${event.venue}`,
    event.venueAddress ? `Address: ${event.venueAddress}` : null,
    event.mapUrl ? `Map: ${event.mapUrl}` : null,
  ].filter(Boolean).join('\n');
  const description = escapeIcsText(descriptionLines);

  let dateBlock = '';
  if (event.time && event.time.start && event.time.end) {
    const d = toIcsDateOnly(event.dateISO);
    const startH = event.time.start.replace(':', '') + '00';
    const endH = event.time.end.replace(':', '') + '00';
    dateBlock = [
      `DTSTART;TZID=Asia/Kolkata:${d}T${startH}`,
      `DTEND;TZID=Asia/Kolkata:${d}T${endH}`,
    ].join('\r\n');
  } else {
    // All-day event
    const dStart = toIcsDateOnly(event.dateISO);
    const dEnd = getNextDayIcsDate(event.dateISO);
    dateBlock = [
      `DTSTART;VALUE=DATE:${dStart}`,
      `DTEND;VALUE=DATE:${dEnd}`,
    ].join('\r\n');
  }

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sneha & Dipak Royal Wedding//Save the Date//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Kolkata',
    'X-LIC-LOCATION:Asia/Kolkata',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    dateBlock,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\r\n');
}

/**
 * Trigger client-side download of the .ics file
 * Automatically cleans up object URL
 * @param {Object} event
 */
export function downloadIcsFile(event) {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', `sneha-dipak-${event.id}-invitation.ics`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 2000);
}
