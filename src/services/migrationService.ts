import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import {
  defaultHomePageContent,
  defaultAboutPageContent,
  defaultPrintMedia,
  defaultDigitalMedia,
  defaultBusinesses,
  defaultSocialProfiles,
  defaultContactSettings,
} from './defaultData.ts';

export interface MigrationStatus {
  completed: boolean;
  migratedAt?: string;
  itemCounts?: {
    printMedia: number;
    digitalMedia: number;
    businesses: number;
    socialProfiles: number;
  };
}

/**
 * Check if the Firestore database has already been seeded.
 */
export async function checkMigrationStatus(): Promise<MigrationStatus> {
  try {
    const migrationDocRef = doc(db, 'system', 'migration');
    const snap = await getDoc(migrationDocRef);

    if (snap.exists() && snap.data()?.completed === true) {
      return {
        completed: true,
        migratedAt: snap.data()?.migratedAt,
        itemCounts: snap.data()?.itemCounts,
      };
    }
    return { completed: false };
  } catch (err) {
    console.warn('Migration status check notice (offline or uninitialized):', err);
    return { completed: false };
  }
}

/**
 * Execute one-time seed migration from hardcoded portfolio data to Firestore.
 * If force is true, it overrides previous migration status.
 */
export async function runMigration(force: boolean = false): Promise<{ success: boolean; message: string }> {
  try {
    const status = await checkMigrationStatus();
    if (!force && status.completed) {
      return { success: true, message: 'Database was already migrated. No overwrite occurred.' };
    }

    const timestamp = new Date().toISOString();

    // 1. Migrate Home Page Settings
    await setDoc(doc(db, 'siteSettings', 'home'), {
      ...defaultHomePageContent,
      updatedAt: timestamp,
    }, { merge: true });

    // 2. Migrate About Us Settings
    await setDoc(doc(db, 'siteSettings', 'about'), {
      ...defaultAboutPageContent,
      updatedAt: timestamp,
    }, { merge: true });

    // 3. Migrate Contact Settings
    await setDoc(doc(db, 'siteSettings', 'contact'), {
      ...defaultContactSettings,
      updatedAt: timestamp,
    }, { merge: true });

    // 4. Migrate Print Media Clippings
    for (const item of defaultPrintMedia) {
      await setDoc(doc(db, 'media_print', item.id), {
        ...item,
        createdAt: timestamp,
        updatedAt: timestamp,
      }, { merge: true });
    }

    // 5. Migrate Digital Media Videos
    for (const item of defaultDigitalMedia) {
      await setDoc(doc(db, 'media_digital', item.id), {
        ...item,
        createdAt: timestamp,
        updatedAt: timestamp,
      }, { merge: true });
    }

    // 6. Migrate Businesses
    for (const biz of defaultBusinesses) {
      await setDoc(doc(db, 'businesses', biz.id), {
        ...biz,
        updatedAt: timestamp,
      }, { merge: true });
    }

    // 7. Migrate Social Profiles
    for (const profile of defaultSocialProfiles) {
      await setDoc(doc(db, 'socialProfiles', profile.id), {
        ...profile,
        updatedAt: timestamp,
      }, { merge: true });
    }

    // 8. Record Migration Completion Flag
    const counts = {
      printMedia: defaultPrintMedia.length,
      digitalMedia: defaultDigitalMedia.length,
      businesses: defaultBusinesses.length,
      socialProfiles: defaultSocialProfiles.length,
    };

    await setDoc(doc(db, 'system', 'migration'), {
      completed: true,
      migratedAt: timestamp,
      itemCounts: counts,
    });

    return {
      success: true,
      message: `Successfully migrated all portfolio sections into Firestore (${counts.printMedia} print, ${counts.digitalMedia} digital, ${counts.businesses} businesses, ${counts.socialProfiles} socials).`,
    };
  } catch (error: any) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: `Migration failed: ${error?.message || 'Unknown Firestore error'}. Check Firestore rules and network connectivity.`,
    };
  }
}
