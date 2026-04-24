import { useState, useMemo } from 'react'
import { useSearchReleases, useReleaseGroup, useRelease, useCoverArtUrl } from '../utils/musicbrainz'
import type { MusicBrainzReleaseGroup, MusicBrainzRelease, MusicBrainzTrack } from '../types/musicbrainz'

export interface AlbumData {
  release: MusicBrainzRelease
  coverUrl: string
  tracks: MusicBrainzTrack[]
}

export function useAlbumSearch() {
  const [query, setQuery] = useState('')
  
  const { data: searchResults = [], isLoading: searching } = useSearchReleases(query)
  
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  
  const { data: releaseGroup } = useReleaseGroup(selectedGroupId || undefined)
  const releaseId = releaseGroup?.releases?.[0]?.id
  
  const { data: release, isLoading: loadingRelease } = useRelease(releaseId)
  const coverUrl = useCoverArtUrl(releaseId)
  
  const selectedAlbum: AlbumData | null = useMemo(() => {
    if (!release && !releaseGroup) return null
    
    const tracks: MusicBrainzTrack[] = release?.media?.flatMap(m => m.tracks || []) || []
    
    const releaseData: MusicBrainzRelease = release || {
      id: releaseGroup?.releases?.[0]?.id || selectedGroupId || '',
      title: releaseGroup?.title || '',
      date: releaseGroup?.['first-release-date'],
      releaseGroup: { 
        id: selectedGroupId || '', 
        primaryType: releaseGroup?.['primary-type']
      }
    }
    
    return {
      release: releaseData,
      coverUrl,
      tracks
    }
  }, [release, releaseGroup, coverUrl, selectedGroupId])
  
  const search = (q: string) => setQuery(q)
  
  const selectAlbum = (group: MusicBrainzReleaseGroup) => {
    setSelectedGroupId(group.id)
  }
  
  const clearSelection = () => {
    setSelectedGroupId(null)
  }
  
  const loadAlbumById = (groupId: string) => {
    setSelectedGroupId(groupId)
  }
  
  return {
    results: searchResults,
    selectedAlbum,
    loading: loadingRelease,
    searching,
    search,
    selectAlbum,
    clearSelection,
    loadAlbumById
  }
}