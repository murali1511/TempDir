// ~/composables/useFirebaseDate.js
// Utility composable for converting between Firestore Timestamp, JS Date, and formatted strings.

export function useFirebaseDate() {
  /**
   * ✅ toJSDate(value)
   * Converts Firestore Timestamp, SDK Timestamp, Date, ISO string, or number to JS Date.
   */
  function toJSDate(value) {
    if (value === null || value === undefined) return null;

    // Firestore SDK Timestamp
    if (typeof value === "object" && typeof value.toDate === "function") {
      return value.toDate();
    }

    // Raw object { seconds, nanoseconds }
    if (typeof value === "object" && value.seconds !== undefined) {
      const secs = Number(value.seconds) || 0;
      const nanos = Number(value.nanoseconds) || 0;
      return new Date(secs * 1000 + Math.floor(nanos / 1e6));
    }

    // Already a Date
    if (value instanceof Date) return value;

    // Number: seconds (<=10 digits) or milliseconds
    if (typeof value === "number") {
      const len = Math.floor(Math.abs(value)).toString().length;
      return len <= 10 ? new Date(value * 1000) : new Date(value);
    }

    // String (ISO or numeric)
    if (typeof value === "string") {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
      const n = Number(value);
      if (!isNaN(n)) {
        const len = Math.floor(Math.abs(n)).toString().length;
        return len <= 10 ? new Date(n * 1000) : new Date(n);
      }
    }

    return null;
  }

  /**
   * ✅ formatDateLocal(date)
   * Fallback formatter -> "dd/mm/yyyy hh:mm AM/PM" using local system time.
   */
  function formatDateLocal(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }

  /**
   * ✅ prettyDate(value, { timeZone })
   * Converts Firestore Timestamp → formatted "dd/mm/yyyy hh:mm AM/PM" string
   * Defaults to Asia/Kolkata timezone.
   */
  function prettyDate(value, { timeZone = "Asia/Kolkata" } = {}) {
    const d = toJSDate(value);
    if (!d) return "-";
    try {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return fmt.format(d).replace(",", "");
    } catch {
      return formatDateLocal(d);
    }
  }

  /**
   * ✅ dateToFirebaseTimestamp(value)
   * Converts JS Date or anything parseable by toJSDate -> Firestore { seconds, nanoseconds }
   */
  function dateToFirebaseTimestamp(value) {
    const d = toJSDate(value);
    if (!d) return null;
    const ms = d.getTime();
    const seconds = Math.floor(ms / 1000);
    const nanoseconds = Math.floor((ms % 1000) * 1e6);
    return { seconds, nanoseconds };
  }

  /**
   * ✅ parsePrettyDateString(str)
   * Parses "dd/mm/yyyy hh:mm AM/PM" string (Asia/Kolkata local time)
   * back to JS Date (UTC instant).
   */
  function parsePrettyDateString(str) {
    if (!str || typeof str !== "string") return null;

    const cleaned = str.replace(",", "").trim();
    const parts = cleaned.split(/\s+/);
    if (parts.length < 2) return null;

    const datePart = parts[0];
    const timePart = parts[1];
    const ampm = (parts[2] || "").toUpperCase();

    const [day, month, year] = datePart.split("/").map((x) => parseInt(x, 10));
    const [hourPart, minutePart] = timePart.split(":").map((x) => parseInt(x, 10));

    if (!day || !month || !year || isNaN(hourPart) || isNaN(minutePart)) return null;

    let hours = hourPart;
    const minutes = minutePart;
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    // Convert Asia/Kolkata local to UTC instant
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const utcMs = Date.UTC(year, month - 1, day, hours, minutes) - IST_OFFSET_MS;
    return new Date(utcMs);
  }

  return {
    toJSDate,
    formatDateLocal,
    prettyDate,
    dateToFirebaseTimestamp,
    parsePrettyDateString,
  };
}
