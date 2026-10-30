import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import {
  HomePageContent,
  AboutPageContent,
  PrintMediaDoc,
  DigitalMediaDoc,
  SocialProfileDoc,
  BusinessDoc,
  ContactSettingsDoc,
} from '../types/cms.ts';
import {
  defaultHomePageContent,
  defaultAboutPageContent,
  defaultPrintMedia,
  defaultDigitalMedia,
  defaultBusinesses,
  defaultSocialProfiles,
  defaultContactSettings,
} from '../services/defaultData.ts';

/**
 * Hook for Home Page dynamic content
 */
export function useHomePageContent() {
  const [data, setData] = useState<HomePageContent>(defaultHomePageContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'siteSettings', 'home');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const remote = snap.data() as Partial<HomePageContent>;
        setData({
          hero: { ...defaultHomePageContent.hero, ...remote.hero },
          aboutPreview: { ...defaultHomePageContent.aboutPreview, ...remote.aboutPreview },
          impactStats: remote.impactStats && remote.impactStats.length ? remote.impactStats : defaultHomePageContent.impactStats,
          updatedAt: remote.updatedAt,
        });
      }
      setError(null);
    } catch (err: any) {
      console.warn('Using default home content:', err?.message);
      setError(err?.message || 'Failed to load remote content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { data, loading, error, reload: fetchContent };
}

/**
 * Hook for About Page dynamic content
 */
export function useAboutPageContent() {
  const [data, setData] = useState<AboutPageContent>(defaultAboutPageContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'siteSettings', 'about');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const remote = snap.data() as Partial<AboutPageContent>;
        setData({
          hero: { ...defaultAboutPageContent.hero, ...remote.hero },
          story: { ...defaultAboutPageContent.story, ...remote.story },
          timeline: remote.timeline && remote.timeline.length ? remote.timeline : defaultAboutPageContent.timeline,
          missionVision: { ...defaultAboutPageContent.missionVision, ...remote.missionVision },
          peoplesAssociation: { ...defaultAboutPageContent.peoplesAssociation, ...remote.peoplesAssociation },
          updatedAt: remote.updatedAt,
        });
      }
      setError(null);
    } catch (err: any) {
      console.warn('Using default about content:', err?.message);
      setError(err?.message || 'Failed to load remote content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { data, loading, error, reload: fetchContent };
}

/**
 * Hook for Print Media Clippings (with real-time updates)
 */
export function usePrintMedia(onlyActive: boolean = true) {
  const [data, setData] = useState<PrintMediaDoc[]>(defaultPrintMedia);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'media_print'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: PrintMediaDoc[] = [];
            snapshot.forEach((docSnap) => {
              const item = { id: docSnap.id, ...docSnap.data() } as PrintMediaDoc;
              if (!onlyActive || item.isActive !== false) {
                items.push(item);
              }
            });
            setData(items);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Real-time listener notice for print media, using defaults:', err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('Using default print media:', err?.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onlyActive]);

  return { data, loading, error, setData };
}

/**
 * Hook for Digital Media Videos (with real-time updates)
 */
export function useDigitalMedia(onlyActive: boolean = true) {
  const [data, setData] = useState<DigitalMediaDoc[]>(defaultDigitalMedia);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'media_digital'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: DigitalMediaDoc[] = [];
            snapshot.forEach((docSnap) => {
              const item = { id: docSnap.id, ...docSnap.data() } as DigitalMediaDoc;
              if (!onlyActive || item.isActive !== false) {
                items.push(item);
              }
            });
            setData(items);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Real-time listener notice for digital media, using defaults:', err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('Using default digital media:', err?.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onlyActive]);

  return { data, loading, error, setData };
}

/**
 * Hook for Business Ventures (with real-time updates)
 */
export function useBusinesses(onlyActive: boolean = true) {
  const [data, setData] = useState<BusinessDoc[]>(defaultBusinesses);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'businesses'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: BusinessDoc[] = [];
            snapshot.forEach((docSnap) => {
              const item = { id: docSnap.id, ...docSnap.data() } as BusinessDoc;
              if (!onlyActive || item.isActive !== false) {
                items.push(item);
              }
            });
            setData(items);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Real-time listener notice for businesses, using defaults:', err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('Using default businesses:', err?.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onlyActive]);

  return { data, loading, error, setData };
}

/**
 * Hook for Social Profiles (with real-time updates)
 */
export function useSocialProfiles(onlyActive: boolean = true) {
  const [data, setData] = useState<SocialProfileDoc[]>(defaultSocialProfiles);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'socialProfiles'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: SocialProfileDoc[] = [];
            snapshot.forEach((docSnap) => {
              const item = { id: docSnap.id, ...docSnap.data() } as SocialProfileDoc;
              if (!onlyActive || item.isActive !== false) {
                items.push(item);
              }
            });
            setData(items);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Real-time listener notice for social profiles, using defaults:', err.message);
          setLoading(false);
        }
      );
    } catch (err: any) {
      console.warn('Using default social profiles:', err?.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onlyActive]);

  return { data, loading, error, setData };
}

/**
 * Hook for Contact Details & Settings
 */
export function useContactSettings() {
  const [data, setData] = useState<ContactSettingsDoc>(defaultContactSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'siteSettings', 'contact');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setData({
          ...defaultContactSettings,
          ...snap.data(),
        } as ContactSettingsDoc);
      }
      setError(null);
    } catch (err: any) {
      console.warn('Using default contact settings:', err?.message);
      setError(err?.message || 'Failed to load remote contact settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { data, loading, error, reload: fetchSettings };
}

