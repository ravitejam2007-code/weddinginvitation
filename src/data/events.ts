import { formatWeddingDate, formatWeddingTime, wedding, weddingDateTimeUtc } from './wedding';

export interface WeddingEvent {
  id: string;
  title: string;
  vernacularTitle?: string;
  date: string;
  calendarDate: string; // ISO date format for chronological sorting & calendar exports (YYYY-MM-DD)
  calendarTime: string;
  startTime: string;
  venue: string;
  venueAddress: string;
  mapsUrl: string;
  dressCode: string;
  dressCodeTheme?: string;
  quote: string;
  image: string;
  hasScratchReveal?: boolean;
  interactiveActionLabel?: string;
}

export const weddingEvents: WeddingEvent[] = wedding.events.map((event) => ({
  ...event,
  date: formatWeddingDate(event.date),
  calendarDate: event.date,
  calendarTime: event.startTime,
  startTime: `${formatWeddingTime(event.startTime)} Onwards`,
  venue: wedding.venue.name,
  venueAddress: wedding.venue.address,
  mapsUrl: wedding.venue.mapsUrl,
}));

const calendarStart = (event: WeddingEvent) => weddingDateTimeUtc(event.calendarDate, event.calendarTime);

const calendarEvent = (event: WeddingEvent) => [
  'BEGIN:VEVENT',
  `UID:${event.id}-${event.calendarDate}@${wedding.couple.slug}.wedding`,
  `SUMMARY:${event.title} - ${wedding.couple.brideName} & ${wedding.couple.groomName}`,
  `DESCRIPTION:${event.quote} Venue: ${event.venue}. Dress code: ${event.dressCode}`,
  `LOCATION:${event.venue}, ${event.venueAddress}`,
  `DTSTART:${calendarStart(event)}`,
  'STATUS:CONFIRMED',
  'END:VEVENT',
].join('\r\n');

// Helper to generate and download ICS calendar event
export const downloadEventCalendar = (event: WeddingEvent) => {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${wedding.couple.brideName} & ${wedding.couple.groomName} Wedding//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    calendarEvent(event),
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.id}-ceremony.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper to generate a combined calendar file for all 4 wedding ceremonies
export const downloadFullWeddingCalendar = () => {
  const eventsIcs = weddingEvents.map(calendarEvent).join('\r\n');

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${wedding.couple.brideName} & ${wedding.couple.groomName} Wedding//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    eventsIcs,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${wedding.couple.slug}-wedding-suite.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

