import { useState, useEffect } from 'react'
import { SearchBar } from './components/SearchBar'
import { AlbumList } from './components/AlbumList'
import { AlbumPoster } from './components/AlbumPoster'
import { useAlbumSearch } from './hooks/useAlbumSearch'
import { exportToPDF } from './utils/pdfExport'
import type { MusicBrainzReleaseGroup } from './types/musicbrainz'

function getPathParam() {
  const path = window.location.pathname
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const segment = path.replace(base, '').replace(/^\//, '')
  const parts = segment.split('/')
  return {
    search: decodeURIComponent(parts[0] || ''),
    albumId: parts[1] || ''
  }
}

function setPathParam(value: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const url = new URL(window.location.href)
  url.pathname = `${base}/${value}`
  window.history.pushState({}, '', url.toString())
}

export default function App() {
  const [query, setQuery] = useState(getPathParam().search)
  const { results, selectedAlbum, loading, searching, search, selectAlbum, clearSelection, loadAlbumById } = useAlbumSearch()

  useEffect(() => {
    const { search: q, albumId } = getPathParam()
    if (q) {
      setQuery(q)
      search(q)
    }
    if (albumId) {
      loadAlbumById(albumId)
    }
  }, [search, loadAlbumById])

  const handleSearch = () => {
    setPathParam(query)
    search(query)
  }

  const handleSelectAlbum = (group: MusicBrainzReleaseGroup) => {
    const albumPath = `${encodeURIComponent(query)}/${group.id}`
    setPathParam(albumPath)
    selectAlbum(group)
  }

  const handleClear = () => {
    setPathParam(query)
    clearSelection()
  }

  const handleExport = async () => {
    if (!selectedAlbum) return
    await exportToPDF({
      album: selectedAlbum.release,
      coverUrl: selectedAlbum.coverUrl,
      tracks: selectedAlbum.tracks
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="p-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-center">CoverDrop</h1>
      </nav>

      <main className="p-6 max-w-4xl mx-auto">
        {!selectedAlbum ? (
          <>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={handleSearch}
              loading={searching}
            />

            <AlbumList
              results={results}
              onSelect={handleSelectAlbum}
              loading={loading}
            />

            {query && results.length === 0 && !searching && (
              <p className="text-center text-gray-400 mt-8">No albums found. Try a different search.</p>
            )}
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-colors"
              >
                Export PDF
              </button>
            </div>

            <div className="flex justify-center">
              <div className="scale-50 sm:scale-75 md:scale-100 origin-top">
                <AlbumPoster
                  album={selectedAlbum.release}
                  coverUrl={selectedAlbum.coverUrl}
                  tracks={selectedAlbum.tracks}
                  size={600}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}