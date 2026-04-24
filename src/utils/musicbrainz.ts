import { useQuery } from '@tanstack/react-query'
import type { MusicBrainzReleaseGroup, MusicBrainzRelease } from '../types/musicbrainz'

const BASE_URL = 'https://musicbrainz.org/ws/2'
const COVERART_URL = 'https://coverartarchive.org'

async function fetchWithUA<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'CoverDrop/1.0 (https://github.com/xonha/CoverDrop; contact@xonha.github.io)',
      'Accept': 'application/json'
    }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export function useSearchReleases(query: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['searchReleases', query],
    queryFn: async () => {
      const url = `${BASE_URL}/release-group?query=${encodeURIComponent(query)}&fmt=json&limit=20`
      const data = await fetchWithUA<{ 'release-groups': MusicBrainzReleaseGroup[] }>(url)
      return data['release-groups'] || []
    },
    enabled: !!query && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 30
  })
}

export function useRelease(id: string | undefined) {
  return useQuery({
    queryKey: ['release', id],
    queryFn: async () => {
      if (!id) return null
      const url = `${BASE_URL}/release/${id}?fmt=json&inc=release-groups+media+recordings`
      return fetchWithUA<MusicBrainzRelease>(url)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30
  })
}

export function useReleaseGroup(id: string | undefined) {
  return useQuery({
    queryKey: ['releaseGroup', id],
    queryFn: async () => {
      if (!id) return null
      const url = `${BASE_URL}/release-group/${id}?fmt=json&inc=releases`
      return fetchWithUA<MusicBrainzReleaseGroup>(url)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 30
  })
}

export function useCoverArtUrls(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['coverArt', releaseId],
    queryFn: async () => {
      if (!releaseId) return []
      try {
        const res = await fetch(`${COVERART_URL}/release/${releaseId}/`, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'CoverDrop/1.0 (https://github.com/xonha/CoverDrop)',
            'Accept': 'application/json'
          }
        })
        if (!res.ok) return []
        const data = await res.json()
        if (data.images && Array.isArray(data.images)) {
          return data.images
            .map((img: any) => {
              const url = img.thumbnails?.large || img.thumbnails?.small || img.image
              return url?.replace('http://', 'https://')
            })
            .filter(Boolean)
        }
      } catch {}
      return []
    },
    enabled: !!releaseId,
    staleTime: 1000 * 60 * 30
  })
}

export function useCoverArtUrl(releaseId: string | undefined) {
  const { data } = useCoverArtUrls(releaseId)
  return data?.[0] || ''
}

export function useCoverArt(releaseId: string | undefined) {
  return useQuery({
    queryKey: ['coverArt', releaseId],
    queryFn: async () => {
      if (!releaseId) return ''
      try {
        const res = await fetch(`${COVERART_URL}/release/${releaseId}/`, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'CoverDrop/1.0 (https://github.com/xonha/CoverDrop)',
            'Accept': 'application/json'
          }
        })
        if (!res.ok) return ''
        const data = await res.json()
        if (data.images && data.images.length > 0) {
          const img = data.images.find((i: any) => i.front) || data.images[0]
          return img.thumbnails?.large || img.thumbnails?.small || img.image || ''
        }
      } catch {}
      return ''
    },
    enabled: !!releaseId,
    staleTime: 1000 * 60 * 30
  })
}