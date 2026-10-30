import { useState, useEffect } from 'react';
import {
  doc,
  collection,
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
  defaultBusinesses,
  defaultSocialProfiles,
  defaultContactSettings,
} from '../services/defaultData.ts';

/**
 * Hook for Home Page dynamic content with real-time onSnapshot synchronization
 */
export function useHomePageContent() {
  const [data, setData] = useState<HomePageContent>(defaultHomePageContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const docRef = doc(db, 'siteSettings', 'home');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const remote = snap.data() as Partial<HomePageContent>;
            setData({
              hero: { ...defaultHomePageContent.hero, ...remote.hero },
              aboutPreview: { ...defaultHomePageContent.aboutPreview, ...remote.aboutPreview },
              impactStats:
                remote.impactStats && remote.impactStats.length
                  ? remote.impactStats
                  : defaultHomePageContent.impactStats,
              updatedAt: remote.updatedAt,
            });
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Real-time listener for home content notice:', err.message);
          setLoading(false);
          setError(err.message);
        }
      );
    } catch (err: any) {
      console.warn('Error setting up home listener:', err?.message);
      setLoading(false);
      setError(err?.message);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { data, loading, error };
}

/**
 * Hook for About Page dynamic content with real-time onSnapshot synchronization
 */
export function useAboutPageContent() {
  const [data, setData] = useState<AboutPageContent>(defaultAboutPageContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const docRef = doc(db, 'siteSettings', 'about');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const remote = snap.data() as Partial<AboutPageContent>;
            setData({
              hero: { ...defaultAboutPageContent.hero, ...remote.hero },
              story: { ...defaultAboutPageContent.story, ...remote.story },
              timeline:
                remote.timeline && remote.timeline.length
                  ? remote.timeline
                  : defaultAboutPageContent.timeline,
              missionVision: { ...defaultAboutPageContent.missionVision, ...remote.missionVision },
              peoplesAssociation: {
                ...defaultAboutPageContent.peoplesAssociation,
                ...remote.peoplesAssociation,
              },
              updatedAt: remote.updatedAt,
            });
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Real-time listener for about content notice:', err.message);
          setLoading(false);
          setError(err.message);
        }
      );
    } catch (err: any) {
      console.warn('Error setting up about listener:', err?.message);
      setLoading(false);
      setError(err?.message);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { data, loading, error };
}

/**
 * Hook for Print Media Clippings (with real-time onSnapshot sync)
 */
export function usePrintMedia(onlyActive: boolean = true) {
  const [data, setData] = useState<PrintMediaDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'media_print'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: PrintMediaDoc[] = [];
          snapshot.forEach((docSnap) => {
            const item = { id: docSnap.id, ...docSnap.data() } as PrintMediaDoc;
            if (!onlyActive || item.isActive !== false) {
              items.push(item);
            }
          });

          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Print media listener notice:', err.message);
          setLoading(false);
          setError(err.message);
        }
      );
    } catch (err: any) {
      console.warn('Error loading print media:', err?.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onlyActive]);

  return { data, loading, error, setData };
}

/**
 * Hook for Digital Media Videos (with real-time onSnapshot sync)
 */
export function useDigitalMedia(onlyActive: boolean = true) {
  const [data, setData] = useState<DigitalMediaDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const q = query(collection(db, 'media_digital'), orderBy('order', 'asc'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: DigitalMediaDoc[] = [];
          snapshot.forEach((docSnap) => {
            const item = { id: docSnap.id, ...docSnap.data() } as DigitalMediaDoc;
            if (!onlyActive || item.isActive !== false) {
              items.push(item);
            }
          });

          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Digital media listener notice:', err.message);
          setLoading(false);
          setError(err.message);
        }
      );
    } catch (err: any) {
      console.warn('Error loading digital media:', err?.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [onlyActive]);

  return { data, loading, error, setData };
}

/**
 * Hook for Business Ventures (with real-time onSnapshot sync)
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
          const items: BusinessDoc[] = [];
          snapshot.forEach((docSnap) => {
            const item = { id: docSnap.id, ...docSnap.data() } as BusinessDoc;
            if (!onlyActive || item.isActive !== false) {
              items.push(item);
            }
          });

          if (!snapshot.empty) {
            setData(items);
          } else {
            setData(onlyActive ? defaultBusinesses : []);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Businesses listener notice, fallback to defaults:', err.message);
          setLoading(false);
          setError(err.message);
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
 * Hook for Social Profiles (with real-time onSnapshot sync)
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
          const items: SocialProfileDoc[] = [];
          snapshot.forEach((docSnap) => {
            const item = { id: docSnap.id, ...docSnap.data() } as SocialProfileDoc;
            if (!onlyActive || item.isActive !== false) {
              items.push(item);
            }
          });

          if (!snapshot.empty) {
            setData(items);
          } else {
            setData(onlyActive ? defaultSocialProfiles : []);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Social profiles listener notice, fallback to defaults:', err.message);
          setLoading(false);
          setError(err.message);
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
 * Hook for Contact Details & Settings (with real-time onSnapshot sync)
 */
export function useContactSettings() {
  const [data, setData] = useState<ContactSettingsDoc>(defaultContactSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const docRef = doc(db, 'siteSettings', 'contact');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            setData({
              ...defaultContactSettings,
              ...snap.data(),
            } as ContactSettingsDoc);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.warn('Contact settings listener notice:', err.message);
          setLoading(false);
          setError(err.message);
        }
      );
    } catch (err: any) {
      console.warn('Error setting up contact listener:', err?.message);
      setLoading(false);
      setError(err?.message);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { data, loading, error };
}
