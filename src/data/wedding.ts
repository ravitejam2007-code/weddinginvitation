export interface WeddingEventData {
  id: 'haldi' | 'mehndi' | 'sangeet' | 'wedding';
  title: string;
  vernacularTitle?: string;
  date: string;
  startTime: string;
  dressCode: string;
  dressCodeTheme?: string;
  quote: string;
  image: string;
  hasScratchReveal?: boolean;
  interactiveActionLabel?: string;
}

export const wedding = {
  timezone: 'Asia/Kolkata',
  couple: {
    brideName: 'Ashmita',
    groomName: 'Sripad',
    hashtag: '#ASHMITAWEDSSRIPAD',
    slug: 'ashmita-sripad',
  },
  families: {
    bride: {
      parents: 'Anita & S. R. Naidu',
      invitationLine: 'Mr. & Mrs. Anita & S. R. Naidu',
      lineage: 'Daughter of Anita & S. R. Naidu',
    },
    groom: {
      parents: 'Madhu & Ram Reddy',
      invitationLine: 'Mr. & Mrs. Madhu & Ram Reddy',
      lineage: 'Son of Madhu & Ram Reddy',
    },
  },
  ceremony: {
    date: '2026-12-11',
    startTime: '18:00',
  },
  venue: {
    name: 'Taj Palace, Hyderabad',
    formalName: 'The Taj Palace, Hyderabad',
    address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
    mapsUrl: 'https://maps.google.com/?q=Taj+Palace+Hyderabad',
  },
  rsvpDeadline: '2026-11-15',
  events: [
    {
      id: 'haldi',
      title: 'Haldi Ceremony',
      vernacularTitle: 'Manjal Neerattu Vizha',
      date: '2026-12-08',
      startTime: '18:00',
      dressCode: 'Bright Yellows & Sunny Shades',
      dressCodeTheme: 'Sunny yellow kurtas and floral sarees',
      quote: 'Turmeric, laughter and the very first blessings of our sacred union.',
      image: '/images/haldi_ceremony.jpg',
      hasScratchReveal: true,
      interactiveActionLabel: 'Scratch to Reveal',
    },
    {
      id: 'mehndi',
      title: 'Mehndi Ceremony',
      vernacularTitle: 'Where henna meets hearts',
      date: '2026-12-09',
      startTime: '17:30',
      dressCode: 'Pastel & Floral Elegance',
      dressCodeTheme: 'Gentle blush pinks, sage greens and floral prints',
      quote: 'The deeper the mehndi, the deeper the love that binds us together.',
      image: '/images/mehndi_ceremony.jpg',
      hasScratchReveal: false,
      interactiveActionLabel: 'Trace Henna Heart',
    },
    {
      id: 'sangeet',
      title: 'Sangeet Night',
      vernacularTitle: 'An evening of song and dance',
      date: '2026-12-10',
      startTime: '18:00',
      dressCode: 'Royal Indo-Western & Glitz',
      dressCodeTheme: 'Rich jewel tones with shimmer and embroidery',
      quote: 'Music, dance and the whole family dancing in joyous rhythm.',
      image: '/images/sangeet_ceremony.jpg',
      hasScratchReveal: false,
      interactiveActionLabel: 'Tap the Dhol',
    },
    {
      id: 'wedding',
      title: 'The Wedding Ceremony',
      vernacularTitle: 'The Auspicious Muhurtham',
      date: '2026-12-11',
      startTime: '18:00',
      dressCode: 'Traditional Royal Silk',
      dressCodeTheme: 'Kanjeevaram silk sarees & traditional veshtis with gold zari',
      quote: 'The sacred vows, the holy fire, and the eternal seven steps — with your heartfelt blessings.',
      image: '/images/couple_portrait.jpg',
      hasScratchReveal: false,
    },
  ] satisfies WeddingEventData[],
} as const;

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  timeZone: 'UTC',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const formatWeddingDate = (isoDate: string): string =>
  dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));

export const formatWeddingDateShort = (isoDate: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00Z`));

export const formatWeddingDateChip = (isoDate: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${isoDate}T00:00:00Z`));

export const formatWeddingTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(Date.UTC(2026, 0, 1, hours, minutes))).toUpperCase();
};

export const weddingDateTimeUtc = (date: string, time: string): string => {
  const [hours, minutes] = time.split(':');
  return new Date(`${date}T${hours}:${minutes}:00+05:30`)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('.000', '');
};

export const getWeddingEvent = (id: WeddingEventData['id']): WeddingEventData =>
  wedding.events.find((event) => event.id === id)!;