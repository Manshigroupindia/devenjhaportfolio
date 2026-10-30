import {
  GalleryCategoryKey,
  GalleryCategoryMeta,
  GalleryImageItem,
  GalleryVideoItem,
} from '../types/gallery.ts';

export const GALLERY_CATEGORIES: Record<GalleryCategoryKey, GalleryCategoryMeta> = {
  awards: {
    key: 'awards',
    route: 'gallery-awards',
    navLabel: 'Awards',
    eyebrow: 'HONOURS & RECOGNITION',
    heading: 'Awards & Recognitions',
    subtitle: 'Moments of appreciation and recognition throughout my journey.',
    description:
      'Archival citations, commemorative certificates, and formal tokens of appreciation recognizing two decades of tireless grassroots social welfare.',
  },
  celebrities: {
    key: 'celebrities',
    route: 'gallery-celebrities',
    navLabel: 'Pictures With Celebrities',
    eyebrow: 'VIP & PUBLIC FIGURES',
    heading: 'Moments With Distinguished Personalities',
    subtitle: 'Memorable moments with celebrities, public figures and distinguished personalities.',
    description:
      'Memorable interactions, celebrity management sessions, and public gatherings connecting notable personalities with cultural and humanitarian causes.',
  },
  social: {
    key: 'social',
    route: 'gallery-social',
    navLabel: 'Social Events',
    eyebrow: 'COMMUNITY & SERVICE',
    heading: 'Social Events & Initiatives',
    subtitle: 'Capturing moments of community service, social initiatives and meaningful gatherings.',
    description:
      'Field photographs documenting free education drives, clothing distributions, ration assistance, and public welfare gatherings across 15 states of India.',
  },
  invitations: {
    key: 'invitations',
    route: 'gallery-invitations',
    navLabel: 'Program Invitations',
    eyebrow: 'EVENTS & CONVENTIONS',
    heading: 'Events & Invitations',
    subtitle: 'A collection of invitations, event participation and special occasions.',
    description:
      'Official invitation letters, delegate passes, and program schedule cards from state-level conventions, cultural galas, and civil society forums.',
  },
  videos: {
    key: 'videos',
    route: 'gallery-videos',
    navLabel: 'Videos',
    eyebrow: 'BROADCASTS & FOOTAGE',
    heading: 'Videos & Memories',
    subtitle: 'Watch memorable moments, activities and appearances.',
    description:
      'Live recorded video clips, televised interviews, and documentary coverage documenting key humanitarian milestones and public interactions.',
  },
  personal: {
    key: 'personal',
    route: 'gallery-personal',
    navLabel: 'Personal Pictures',
    eyebrow: 'MEMORIES & REFLECTIONS',
    heading: 'Personal Moments',
    subtitle: 'A glimpse into personal memories and moments beyond professional life.',
    description:
      'Candid portraits, personal milestones, and retrospective photographs capturing the human journey behind the public leader.',
  },
};

export const GALLERY_IMAGES: Record<Exclude<GalleryCategoryKey, 'videos'>, GalleryImageItem[]> = {
  awards: [
    {
      id: 'award-1',
      category: 'awards',
      image: '/images/award-1.png',
      title: 'Iconic Creation of God National Honour Citation',
      subtitle: 'Outstanding Humanitarian Contribution Certificate',
      date: '15 Jan 2024',
      location: 'New Delhi',
      description:
        'Formal certificate and verification citation presented in recognition of sustained social reform, youth leadership, and non-profit welfare.',
      aspectRatio: 'landscape',
    },
    {
      id: 'award-2',
      category: 'awards',
      image: '/images/award-2.png',
      title: 'Verified Certificate of Appreciation & Social Recognition',
      subtitle: 'Honouring 20+ Years of Unwavering Community Leadership',
      date: '10 Oct 2023',
      location: 'Delhi NCR',
      description:
        'Commemorative distinction awarded for championing child education relief and expanding the volunteer network of People\'s Association across 15 states.',
      aspectRatio: 'landscape',
    },
  ],

  celebrities: [
    {
      id: 'celeb-1',
      category: 'celebrities',
      image: '/images/celebrity-1.png',
      title: 'Celebrity Bulaye Star Gala Coordination',
      subtitle: 'Celebrity Coordination & Artistic Collaboration',
      date: '2024',
      location: 'Mumbai / Delhi',
      description:
        'Interacting with distinguished public figures and artists during executive artist management and cultural event appearances.',
      aspectRatio: 'portrait',
    },
    {
      id: 'celeb-2',
      category: 'celebrities',
      image: '/images/celebrity-2.png',
      title: 'VIP Industry Summit & High-Profile Gathering',
      subtitle: 'Star Management & Philanthropic Outreach',
      date: '2024',
      location: 'New Delhi',
      description:
        'Bridging popular personalities with social impact causes to raise awareness for education and welfare programs.',
      aspectRatio: 'landscape',
    },
  ],

  social: [
    {
      id: 'social-1',
      category: 'social',
      image: '/images/about-group.png',
      title: "People's Association Community Youth & Relief Drive",
      subtitle: 'Fieldwork Volunteers & Beneficiaries',
      date: '2024',
      location: 'North India Outreach',
      description:
        'Active youth volunteers and students coming together during a community food distribution and free study kit handover program.',
      aspectRatio: 'square',
    },
    {
      id: 'social-2',
      category: 'social',
      image: '/images/appointment-banner.png',
      title: 'Grassroots Strategy & Welfare Review Meeting',
      subtitle: 'Civil Society Planning Session',
      date: '2023',
      location: 'New Delhi Office',
      description:
        'Organizing regional coordinators to coordinate medical checkup camps, ration supplies, and winter apparel distributions.',
      aspectRatio: 'landscape',
    },
  ],

  invitations: [
    {
      id: 'inv-1',
      category: 'invitations',
      image: '/images/invitation-1.png',
      title: 'Iconic Creation of God Special Guest Invitation',
      subtitle: 'Official Annual Awards Gala Pass',
      date: '2024',
      location: 'New Delhi',
      description:
        'Executive invitation card and verification badge for special dignitaries participating in the annual award ceremony.',
      aspectRatio: 'portrait',
    },
    {
      id: 'inv-2',
      category: 'invitations',
      image: '/images/invitation-2.png',
      title: 'National Humanitarian Summit Invitation & Programme Sheet',
      subtitle: 'Leadership & Social Welfare Forum',
      date: '2023',
      location: 'New Delhi',
      description:
        'Formal protocol invitation sheet outlining keynote addresses and philanthropic panel sessions.',
      aspectRatio: 'portrait',
    },
  ],

  personal: [
    {
      id: 'pers-1',
      category: 'personal',
      image: '/images/hero-portrait.png',
      title: 'Portrait at India Gate in Traditional Attire',
      subtitle: 'Reflections in New Delhi',
      date: 'New Delhi',
      location: 'India Gate, New Delhi',
      description:
        'Reflecting on two decades in the capital city, from arriving in 2004 with a vision of service to leading national initiatives.',
      aspectRatio: 'portrait',
    },
    {
      id: 'pers-2',
      category: 'personal',
      image: '/images/about-portrait.png',
      title: 'Formal Executive Portrait in Blue Tie',
      subtitle: 'Studio Profile Photograph',
      date: 'New Delhi',
      location: 'New Delhi',
      description:
        'Portrait reflecting leadership, integrity, and lifelong dedication to building a prosperous and compassionate society.',
      aspectRatio: 'portrait',
    },
    {
      id: 'pers-3',
      category: 'personal',
      image: '/images/docx_photo.png',
      title: 'Archival Portfolio Profile',
      subtitle: 'Original Verified Portfolio Image',
      date: 'Documentary Record',
      location: 'New Delhi',
      description:
        'Original authentic portrait preserving the journey and identity of Devendra Kumar Jha (Deven Jha).',
      aspectRatio: 'square',
    },
  ],
};

export const GALLERY_VIDEOS: GalleryVideoItem[] = [
  {
    id: 'vid-1',
    category: 'videos',
    thumbnail: '/images/media-aaj-tak.png',
    title: 'Aaj Tak Special Interview: Youth Leadership & Social Service',
    channel: 'Aaj Tak Digital',
    date: '14 Jun 2024',
    duration: '24:18',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    description:
      'Devendra Kumar Jha discusses grassroots organizing, supporting needy families, and empowering youth through education.',
  },
  {
    id: 'vid-2',
    category: 'videos',
    thumbnail: '/images/media-banner.png',
    title: "Janta Live Broadcast: People's Association 15 States Expansion",
    channel: 'Janta Live News',
    date: '28 Mar 2024',
    duration: '18:45',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    description:
      'National conference review addressing hunger relief, free education study centers, and healthcare assistance programs.',
  },
  {
    id: 'vid-3',
    category: 'videos',
    thumbnail: '/images/about-group.png',
    title: 'Documentary: The Journey from Madhubani to Delhi',
    channel: 'Janta Live Production',
    date: '15 Jan 2024',
    duration: '32:10',
    embedUrl: 'https://www.youtube-nocookie.com/embed/live_stream?channel=jantalivenews',
    description:
      'A personal retrospective detailing the early steps taken in 2004 and the founding of People\'s Association in 2016.',
  },
];

