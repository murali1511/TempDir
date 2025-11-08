import { allevents } from "@/stores/events.js";

/**
 * Get today's temple events for a given Temple ID
 * @param {string} templeID - The temple's unique ID (e.g., "T0001")
 * @returns {Array} Today's events sorted by startDate
 */
// utils/TodaysEvents.js

export function getTodaysEventsByTemple(templeID) {
  const today = new Date().toISOString().split('T')[0];

  const temple = allevents.find(t => t.TID === templeID);
  if (!temple) return [];

  return temple.events
    .filter(event => {
      const start = new Date(event.date.startDate).toISOString().split('T')[0];
      const end = new Date(event.date.endDate).toISOString().split('T')[0];
      return today >= start && today <= end;
    })
    .sort((a, b) => new Date(a.date.startDate) - new Date(b.date.startDate))
    .map(event => ({ templeID: temple.TID, templeName: temple.name, ...event }));
}
