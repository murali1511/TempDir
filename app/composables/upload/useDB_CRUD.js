// ~/composables/useDB_CRUD.js
import { useFirestore } from "vuefire";
import {
  collection,
  query,
  getDocs,
  limit as queryLimit,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp,
  setDoc,
  getDoc
} from "firebase/firestore";

export function useFirebaseCRUD() {
  function getDbInstance() {
    const db = useFirestore();
    if (!db) {
      throw new Error(
        "Firestore instance not available. Ensure VueFire is configured and call this on the client (onMounted)."
      );
    }
    return db;
  }

function toFirestoreTimestamp(val) {
  if (val === undefined || val === null || val === "") return null;

  // Already a Firestore Timestamp (duck-typing)
  if (val && typeof val.toDate === "function" && typeof val.seconds === "number") {
    return val;
  }

  // If it's a JS Date
  if (val instanceof Date) {
    if (!isNaN(val.getTime())) return Timestamp.fromDate(val);
    return null;
  }

  // If it's a number, treat as milliseconds (or seconds if small — we assume ms)
  if (typeof val === "number" && !isNaN(val)) {
    return Timestamp.fromMillis(val);
  }

  // If it's a string, try parse
  if (typeof val === "string") {
    // trim to catch whitespace-only
    const s = val.trim();
    if (s === "") return null;

    // If it's ISO-like or yyyy-mm-dd, Date constructor usually works
    const d = new Date(s);
    if (!isNaN(d.getTime())) return Timestamp.fromDate(d);

    // fallback to Date.parse
    const parsed = Date.parse(s);
    if (!isNaN(parsed)) return Timestamp.fromDate(new Date(parsed));

    // couldn't parse
    return null;
  }

  // unknown type -> null
  return null;
}

  async function Read(collectionName, options = {}) {
    const { tid = "", limit = 50 } = options;

    try {
      const db = getDbInstance();
      const eventsCollection = collection(db, collectionName);

      const q = query(
        eventsCollection,
        where("TID", "==", tid),
        queryLimit(limit)
      );

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

 const Create = async (collectionName, event) => {
  try {
    const db = getDbInstance();

    if (!event || typeof event !== "object") {
      throw new Error("Invalid event object");
    }

    // Clone to avoid mutating reactive proxies (important for Vue)
    const e = JSON.parse(JSON.stringify(event));

    // Normalize dates safely
    const sd = toFirestoreTimestamp(e.date?.startDate);
    const ed = toFirestoreTimestamp(e.date?.endDate);

    // Optional: if both are null and you want to fail, you can throw here
    // if (!sd && !ed) throw new Error("At least one date must be provided");

    // Prepare Firestore payload
    const firestoreData = {
      ownerUid: e.ownerUid || null,
      TID: e.TID || null,
      name: e.name || null,
      eventID: e.eventID || null,
      eventTitle: e.eventTitle || null,
      eventDescription: e.eventDescription || null,
      eventCategory: e.eventCategory || null,
      eventIcon: e.eventIcon || null,
      eventColor: e.eventColor || null,
      contact: {
        email: e.contact?.email || null,
        phone: e.contact?.phone || null,
        website: e.contact?.website || null,
        whatsapp: e.contact?.whatsapp || null,
      },
      date: {
        // only include keys if parsed, otherwise set null or omit
        ...(sd !== null ? { startDate: sd } : {}),
        ...(ed !== null ? { endDate: ed } : {}),
      },
      poojaTiming: e.poojaTiming || null,
      highlights: e.highlights || [],
      participation: e.participation || [],
      specialNote: e.specialNote || null,
      createdAt: serverTimestamp(),
      enabled:true
    };

    // Debug: if date conversion failed, log the original values to help diagnose
    if ((e.date?.startDate && sd === null) || (e.date?.endDate && ed === null)) {
      console.warn("Create: some date values couldn't be parsed:", {
        original: { startDate: e.date?.startDate, endDate: e.date?.endDate },
        parsed: { startDate: sd, endDate: ed },
      });
      // Optionally: throw to prevent bad writes
      // throw new Error("Invalid date format for startDate/endDate");
    }

    console.log("Creating event payload:", JSON.parse(JSON.stringify(firestoreData)));
    const docRef = await addDoc(collection(db, collectionName), firestoreData);
    console.log("Document written with ID: ", docRef.id);
    return { id: docRef.id };
  } catch (e) {
    console.error("Error adding document:", e);
    return { error: e?.message || String(e) };
  }
};

  /**
   * Update: only updates fields present in `updatedEvent`.
   * Pass nested objects or use dot-notation keys when needed.
   */
const Update = async (collectionName, docId, updatedEvent) => {
  try {
    const db = getDbInstance();
    if (!docId) throw new Error("Document ID is required for update");
    if (!updatedEvent || typeof updatedEvent !== "object")
      throw new Error("updatedEvent must be an object");

    // Debug
    try { console.log("Update payload:", JSON.parse(JSON.stringify(updatedEvent))); }
    catch (e) { console.log("Update payload (non-serializable):", updatedEvent); }

    const patch = {};

    // Handle non-date fields: copy as-is (top-level merge)
    for (const k of Object.keys(updatedEvent)) {
      if (k === "date") continue;
      patch[k] = updatedEvent[k];
    }

    // Handle date subfields with dot-notation to avoid replacing entire `date` object
    if (updatedEvent.date && typeof updatedEvent.date === "object") {
      const dateKeys = Object.keys(updatedEvent.date);
      for (const key of dateKeys) {
        const val = updatedEvent.date[key]; // e.g. startDate or endDate

        // If user intentionally cleared the field and you want to remove it:
        // import { deleteField } from "firebase/firestore";
        // if (val === null) { patch[`date.${key}`] = deleteField(); continue; }

        // Convert to Firestore Timestamp if parseable, or skip if invalid/empty
        const ts = toFirestoreTimestamp(val); // use helper from previous message
        if (ts !== null) {
          patch[`date.${key}`] = ts;
        } else {
          // If you want to explicitly set null when user clears the date string:
          // if (val === "" || val === null) patch[`date.${key}`] = null;
          // otherwise skip (leave existing value)
        }
      }
    }

    // add updatedAt
    patch.updatedAt = serverTimestamp();

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, patch);

    console.log(`Document (${docId}) updated successfully with patch:`, patch);
    return { success: true, id: docId };
  } catch (e) {
    console.error("❌ Error updating document:", e);
    return { success: false, error: e?.message || String(e) };
  }
};

  const Delete = async (collectionName, docId) => {
    try {
      const db = getDbInstance();
      if (!docId) throw new Error("Document ID is required for delete");

      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { success: true, id: docId };
    } catch (e) {
      console.error("❌ Error deleting document:", e);
      return { success: false, error: e?.message || String(e) };
    }
  };

/* ---------------------------------------------
   1) READ current eventCounter for a TID
---------------------------------------------- */
async function getNextEventID(TID) {
  if (!TID) throw new Error("TID is required");
  const db = getDbInstance();
  const counterRef = doc(db, "private", TID);
  const snap = await getDoc(counterRef);

  if (!snap.exists()) {
    // If not exists, initialize with 0
    await setDoc(counterRef, { eventCounter: 0 });
    return 0;
  }
  const data = snap.data();
  // Step 4: generate padded ID
  const padded = String(data.eventCounter + 1).padStart(5, "0");
  const eventID = `${TID}-EV${padded}`;

  return {
    eventID: eventID,
    counter: data.eventCounter + 1
  };
  
}

/* ---------------------------------------------
   2) WRITE updated counter (increment by 1)
---------------------------------------------- */
async function updateEvent(TID, newValue) {
  if (!TID) throw new Error("TID is required");
  const db = getDbInstance();
  const counterRef = doc(db, "private", TID);

  await updateDoc(counterRef, {
    eventCounter: newValue,
  });

  return newValue;
}


  return { Read, Create, Update, Delete, updateEvent, getNextEventID };
}
