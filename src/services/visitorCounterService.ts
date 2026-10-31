/**
 * Deven Jha Official Portfolio - Visitor Counter Service
 * 
 * Tracks unique visitor browsing sessions and stores the atomic count in Firestore
 * at `siteStats/visitorCounter`.
 * 
 * Tracking Architecture & Deduplication:
 * 1. Initial count baseline: 30,343.
 * 2. Deduplication: Tracks browser sessions using `sessionStorage` and an in-memory
 *    concurrency lock. This prevents duplicate increments from React StrictMode
 *    double-mounting, internal route navigation, or page reloads within the same session.
 * 3. Atomic Updates: Uses Firestore `runTransaction` to handle concurrent visits
 *    safely without race conditions or overwriting.
 * 4. Real-time updates: Subscribes via Firestore `onSnapshot` so visitors see the latest count.
 */

import { doc, runTransaction, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';

const COUNTER_COLLECTION = 'system';
const COUNTER_DOC = 'visitorCounter';
export const INITIAL_VISITOR_COUNT = 30343;

// Session storage key to identify an already counted browsing session
const SESSION_STORAGE_KEY = 'deven_jha_visitor_session_counted';

// In-memory module locks to prevent duplicate calls during React StrictMode mount cycles
let isIncrementInProgress = false;
let hasIncrementedThisSession = false;

/**
 * Record a unique visitor session.
 * Increments the Firestore counter atomically only once per browser session.
 */
export async function recordVisitorSession(): Promise<number | null> {
  // Check if this session was already counted
  if (typeof window !== 'undefined') {
    try {
      const alreadyCounted = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (alreadyCounted || hasIncrementedThisSession || isIncrementInProgress) {
        return null;
      }
    } catch {
      // In private browsing or storage-restricted environments, fallback to in-memory check
      if (hasIncrementedThisSession || isIncrementInProgress) {
        return null;
      }
    }
  }

  isIncrementInProgress = true;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors in restricted iframes
    }
  }

  try {
    const counterRef = doc(db, COUNTER_COLLECTION, COUNTER_DOC);

    const resultCount = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(counterRef);
      const now = new Date().toISOString();

      if (!snap.exists()) {
        // Document does not exist yet: initialize starting at baseline 30343
        const initialData = {
          count: INITIAL_VISITOR_COUNT,
          createdAt: now,
          updatedAt: now,
        };
        transaction.set(counterRef, initialData);
        return INITIAL_VISITOR_COUNT;
      }

      const data = snap.data();
      const currentCount = typeof data?.count === 'number' && !isNaN(data.count)
        ? data.count
        : INITIAL_VISITOR_COUNT;

      const nextCount = currentCount + 1;
      transaction.update(counterRef, {
        count: nextCount,
        updatedAt: now,
      });

      return nextCount;
    });

    hasIncrementedThisSession = true;
    isIncrementInProgress = false;
    return resultCount;
  } catch (error) {
    console.warn('Visitor counter transaction notice:', error);
    isIncrementInProgress = false;
    // If transaction failed due to network, allow retry
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    return null;
  }
}

/**
 * Subscribe to real-time updates for the visitor count from Firestore.
 */
export function subscribeToVisitorCount(
  callback: (count: number) => void
): () => void {
  const counterRef = doc(db, COUNTER_COLLECTION, COUNTER_DOC);

  return onSnapshot(
    counterRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const count = typeof data?.count === 'number' && !isNaN(data.count)
          ? data.count
          : INITIAL_VISITOR_COUNT;
        callback(count);
      } else {
        // Document not yet initialized in Firestore; supply baseline
        callback(INITIAL_VISITOR_COUNT);
      }
    },
    (err) => {
      console.warn('Real-time visitor count subscription fallback:', err);
      // Supply baseline on connection issue
      callback(INITIAL_VISITOR_COUNT);
    }
  );
}

/**
 * One-off fetch of the current visitor count
 */
export async function getVisitorCount(): Promise<number> {
  try {
    const counterRef = doc(db, COUNTER_COLLECTION, COUNTER_DOC);
    const snap = await getDoc(counterRef);
    if (snap.exists()) {
      const data = snap.data();
      return typeof data?.count === 'number' ? data.count : INITIAL_VISITOR_COUNT;
    }
    return INITIAL_VISITOR_COUNT;
  } catch {
    return INITIAL_VISITOR_COUNT;
  }
}

