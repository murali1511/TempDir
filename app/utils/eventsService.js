// utils/eventsService.js
import { allevents as allTemples } from '@/stores/events.js' // adjust path as needed

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

// Parse "MM/DD/YYYY" into a Date object (local timezone)
function parseMDY(dateStr) {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  const mm = parseInt(parts[0], 10)
  const dd = parseInt(parts[1], 10)
  const yyyy = parseInt(parts[2], 10)
  if (Number.isNaN(mm) || Number.isNaN(dd) || Number.isNaN(yyyy)) return null
  return new Date(yyyy, mm - 1, dd)
}

// Return array of month/year pairs { monthIndex, year } inclusive between start and end
function monthsBetweenInclusive(startDate, endDate) {
  if (!startDate || !endDate) return []
  // normalize to first day of their months
  let cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
  const out = []
  while (cur.getTime() <= end.getTime()) {
    out.push({ monthIndex: cur.getMonth(), year: cur.getFullYear() })
    // increment month
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }
  return out
}

/**
 * Get events grouped by MonthName Year for a given TID.
 * If expandSpanning is true (default), events that span multiple months are included in each month.
 *
 * @param {string} tid
 * @param {Object} [opts]
 * @param {boolean} [opts.expandSpanning=true]
 * @returns {Array<{monthYear:string, monthIndex:number, year:number, events: Array}>}
 */
export function getEventsByTID(tid, opts = {}) {
  const { expandSpanning = true } = opts
  if (!tid) return []

  const temple = allTemples.find(t => t.TID === tid)
  if (!temple || !Array.isArray(temple.events)) return []

  // Prepare events with parsed dates
  const prepared = temple.events.map(ev => {
    const s = parseMDY(ev.date?.startDate)
    const e = parseMDY(ev.date?.endDate)
    // fallback: if no end, treat as same as start
    const end = e || s
    return { __parsedStart: s, __parsedEnd: end, ...ev }
  }).filter(ev => ev.__parsedStart) // drop events with no valid start date

  // We'll build a Map key: "monthIndex-year" => block
  const groupsMap = new Map()

  for (const ev of prepared) {
    const start = ev.__parsedStart
    const end = ev.__parsedEnd || start

    // Determine which months this event should appear in
    const monthSlots = expandSpanning ? monthsBetweenInclusive(start, end) : [{ monthIndex: start.getMonth(), year: start.getFullYear() }]

    for (const slot of monthSlots) {
      const key = `${slot.monthIndex}-${slot.year}`
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          monthYear: `${MONTH_NAMES[slot.monthIndex]} ${slot.year}`,
          monthIndex: slot.monthIndex,
          year: slot.year,
          events: []
        })
      }
      // copy event without internal parsed props to avoid leaking internal keys
      const evCopy = { ...ev }
      delete evCopy.__parsedStart
      delete evCopy.__parsedEnd
      groupsMap.get(key).events.push(evCopy)
    }
  }

  // Convert map to array and sort blocks chronologically
  const blocks = Array.from(groupsMap.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.monthIndex - b.monthIndex
  })

  // Sort events inside each block by startDate then endDate
  const parseForSort = (d) => {
    const parts = d?.split?.('/')
    if (!parts || parts.length !== 3) return Infinity
    const mm = parseInt(parts[0], 10)
    const dd = parseInt(parts[1], 10)
    const yyyy = parseInt(parts[2], 10)
    if (Number.isNaN(mm) || Number.isNaN(dd) || Number.isNaN(yyyy)) return Infinity
    return new Date(yyyy, mm - 1, dd).getTime()
  }

  for (const block of blocks) {
    block.events.sort((x, y) => {
      const xs = parseForSort(x.date?.startDate)
      const ys = parseForSort(y.date?.startDate)
      if (xs !== ys) return xs - ys
      const xe = parseForSort(x.date?.endDate)
      const ye = parseForSort(y.date?.endDate)
      return xe - ye
    })
  }

  return blocks
}
