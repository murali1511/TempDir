// ~/composables/useTempleMedia.js
import { ref, computed, watch } from 'vue'

export const useTempleMedia = (templeID = 'T0001') => {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)
  const filter = ref('all') // 'all' | 'image' | 'video'
  const { $i18n } = useNuxtApp()

  const load = async () => {
    loading.value = true
    error.value = null
    try {
      // assuming file is in /media/<templeID>.json
      const res = await fetch(`/media/${templeID}.json`)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      data.value = await res.json()
    } catch (e) {
      error.value = e.message || 'Failed to load'
    } finally {
      loading.value = false
    }
  }

  // filteredByTypeSorted: apply filter (all | image | video) and sort by date desc
  const filteredByTypeSorted = computed(() => {
    if (!data.value || !data.value.media) return []

    const items =
      filter.value === 'all'
        ? data.value.media
        : data.value.media.filter((m) => m.type === filter.value)

    return [...items].sort((a, b) => new Date(b.date) - new Date(a.date))
  })

  // filtered: locale-aware mapping of title/caption
  const filtered = computed(() => {
    const isMalayalam = $i18n?.locale?.value === 'ml'
    return filteredByTypeSorted.value.map((item) => {
      // create a shallow copy so we don't mutate original data
      const copy = { ...item }

      if (isMalayalam) {
        // Use ml_title / ml_caption when present; otherwise fall back to existing fields
        copy.title = item.ml_title ?? item.title
        copy.caption = item.ml_caption ?? item.caption
      } else {
        // Keep English fields as-is
        copy.title = item.title
        copy.caption = item.caption
      }

      return copy
    })
  })

  // Debugging: see what gets filtered, localized and sorted
  watch(
    filtered,
    (val) => {
      console.log('Filtered + Localized + Sorted media:', val)
    },
    { immediate: true }
  )

  return { loading, error, data, load, filter, filtered }
}
