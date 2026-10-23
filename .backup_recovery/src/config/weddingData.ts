export interface WeddingEvent {
  id: string;
  name: string;
  hindiName?: string;
  date: string;
  day: string;
  time?: string;
  venue: string;
  description: string;
  iconName: string;
  badge: string;
}

export interface FamilyMember {
  father: string;
  mother: string;
  childName: string;
  childRole: string;
  side: 'bride' | 'groom';
  photoPlaceholder: string;
}

export const WEDDING_CONFIG = {
  couple: {
    bride: 'Sneha Sinha',
    brideFirstName: 'Sneha',
    groom: 'Dipak Prasad',
    groomFirstName: 'Dipak',
    hashtag: '#SnehaWedsDipak',
  },
  parents: {
    bride: {
      father: 'Shri Prabhat Kumar Sinha',
      mother: 'Smt. Rita Sinha',
    },
    groom: {
      father: 'Shri Suresh Prasad',
      mother: 'Smt. Lilawati Devi',
    },
  },
  weddingDate: '29 November 2026',
  weddingDay: 'Sunday',
  // Target date for countdown (29 Nov 2026 at 18:00 IST)
  countdownTarget: '2026-11-29T18:00:00+05:30',
  venue: {
    name: 'Sethjees Banquet',
    locality: 'Maniktala, Kanchrapara',
    fullAddress: 'Sethjees Banquet, Maniktala, Kanchrapara, West Bengal',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sethjees+Banquet+Maniktala+Kanchrapara',
  },
  events: [
    {
      id: 'tikal',
      name: 'Tikal',
      hindiName: 'तिलक उत्सव',
      date: '27 November 2026',
      day: 'Friday',
      time: 'Evening 6:00 PM onwards',
      venue: 'Sethjees Banquet, Maniktala, Kanchrapara',
      description: 'An auspicious ceremony welcoming the groom and sealing the sacred bond with blessings and joy.',
      iconName: 'Sparkles',
      badge: 'Day 1 — Auspicious Beginnings',
    },
    {
      id: 'matkor',
      name: 'Matkor',
      hindiName: 'मटकोर अनुष्ठान',
      date: '28 November 2026',
      day: 'Saturday',
      time: 'Evening 5:00 PM onwards',
      venue: 'Sethjees Banquet, Maniktala, Kanchrapara',
      description: 'Traditional rituals sanctifying soil and sacred water, filled with joyful folk songs, turmeric, and family festivities.',
      iconName: 'Sun',
      badge: 'Day 2 — Sacred Traditions',
    },
    {
      id: 'shhadi',
      name: 'Shhadi',
      hindiName: 'शुभ विवाह',
      date: '29 November 2026',
      day: 'Sunday',
      time: 'Auspicious Muhurat 7:00 PM onwards',
      venue: 'Sethjees Banquet, Maniktala, Kanchrapara',
      description: 'The divine union of two souls through Saat Phere around the sacred agni, surrounded by love, mantras, and eternal blessings.',
      iconName: 'Heart',
      badge: 'Day 3 — The Grand Wedding',
    },
  ] as WeddingEvent[],
  invitationText: {
    shloka: '॥ श्री गणेशाय नमः ॥',
    blessingText: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
    ganeshBlessingEnglish: 'May Lord Ganesha bless this new journey with happiness, prosperity and endless love.',
    headerInvitedBy: 'Shri Prabhat Kumar Sinha & Smt. Rita Sinha',
    cordialMessage: 'cordially invite you to the wedding ceremony of their beloved daughter',
    groomSonOf: 'Beloved son of Shri Suresh Prasad & Smt. Lilawati Devi',
    finalCelebrationMessage: 'Together with our families, we invite you to celebrate our wedding.',
  },
  scenes: [
    { id: 1, title: 'Scene 1', name: 'The Royal Envelope', hash: 'scene-1' },
    { id: 2, title: 'Scene 2', name: 'Ganesh Ji Reveal', hash: 'scene-2' },
    { id: 3, title: 'Scene 3', name: 'Grand Invitation', hash: 'scene-3' },
    { id: 4, title: 'Scene 4', name: 'Wedding Events', hash: 'scene-4' },
    { id: 5, title: 'Scene 5', name: 'Family Details', hash: 'scene-5' },
    { id: 6, title: 'Scene 6', name: 'Baraat & Finale', hash: 'scene-6' },
  ],
};
