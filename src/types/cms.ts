export interface StatItemDoc {
  id: string;
  label: string;
  target: number;
  formattedTarget: string;
  iconName: 'Users' | 'Smile' | 'Coffee' | 'Calendar' | 'Award' | 'Heart';
}

export interface HomePageContent {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight1: string;
    titleLine2: string;
    titleHighlight2: string;
    description: string;
    fullName: string;
    subname: string;
    location: string;
    portraitImage: string;
    exploreBtnText: string;
    connectBtnText: string;
  };
  aboutPreview: {
    eyebrow: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    portraitImage: string;
    groupImage: string;
    signatureImage: string;
    btnText: string;
  };
  impactStats: StatItemDoc[];
  updatedAt?: string;
}

export interface TimelineItemDoc {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface AboutPageContent {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    heroImage: string;
  };
  story: {
    eyebrow: string;
    heading: string;
    subheading: string;
    paragraphs: string[];
    portraitImage: string;
    signatureImage: string;
  };
  timeline: TimelineItemDoc[];
  missionVision: {
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    coreValues: string[];
  };
  peoplesAssociation: {
    eyebrow: string;
    heading: string;
    description: string;
    impactNumber: string;
    impactLabel: string;
    highlights: string[];
    websiteUrl: string;
  };
  updatedAt?: string;
}

export interface PrintMediaDoc {
  id: string;
  title: string;
  publication: string;
  date: string;
  category: 'National Daily' | 'Magazine' | 'Regional' | 'Press Feature';
  image: string;
  description: string;
  clippingSnippet: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DigitalMediaDoc {
  id: string;
  title: string;
  channel: string;
  date: string;
  category: 'Television Interview' | 'Digital Broadcast' | 'News Coverage' | 'Documentary';
  youtubeUrl: string;
  youtubeId: string;
  embedUrl: string;
  thumbnail: string;
  duration: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialProfileDoc {
  id: string;
  name: string;
  handle: string;
  role: string;
  url: string;
  bgColor: string;
  badgeColor: string;
  iconKey: 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'x' | 'globe' | 'peoples-association';
  order: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface BusinessDoc {
  id: string;
  name: string;
  category: string;
  url: string;
  iconName: 'Users' | 'Tv' | 'Film' | 'Star' | 'LayoutGrid' | 'Building' | 'Briefcase' | 'Globe';
  logoUrl?: string;
  order: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface ContactSettingsDoc {
  phone: string;
  email: string;
  whatsapp: string;
  cityState: string;
  addressNote: string;
  mapsQueryUrl: string;
  mapsPreviewImage: string;
  officeHours: string;
  updatedAt?: string;
}

export interface ContactSubmissionDoc {
  id: string;
  name: string;
  email: string;
  mobile: string;
  state: string;
  purpose: string;
  message: string;
  referenceId: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'archived';
}
