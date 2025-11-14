// ~/composables/useDb.js
import { useFirestore } from "vuefire";
import {
  collection,
  query,
  getDocs,
  limit as queryLimit,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Helper: obtain Firestore instance from VueFire.
 * Must be called client-side (e.g. inside onMounted).
 */
function getDbInstance() {
  const db = useFirestore();
  if (!db) {
    throw new Error(
      "Firestore instance not available. Ensure VueFire is configured and call this on the client (onMounted)."
    );
  }
  return db;
}

/**
 * Check whether a collection has documents (practical 'exists' test).
 * Returns: { exists: boolean, count: number, docs: Array<{id, data}> } or { error }
 *
 * @param {string} collectionName
 * @param {object} options - { limit: number }
 */
export async function checkCollectionExists(collectionName, options = { limit: 3 }) {
  try {
    const db = getDbInstance();
    const q = query(collection(db, collectionName), queryLimit(options.limit || 3));
    const snap = await getDocs(q);

    if (snap.empty) {
      return { exists: false, count: 0, docs: [] };
    }

    const docs = snap.docs.map((d) => ({ id: d.id, data: d.data() }));
    return { exists: true, count: snap.size, docs };
  } catch (err) {
    return { error: err?.message || String(err) };
  }
}
