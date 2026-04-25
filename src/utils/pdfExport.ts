import { jsPDF } from 'jspdf'
import type { MusicBrainzRelease, MusicBrainzTrack } from '../types/musicbrainz'

interface ExportOptions {
  album: MusicBrainzRelease
  coverUrl: string
  tracks: MusicBrainzTrack[]
  coverContrast?: number
  bgColor?: string
  bgOpacity?: number
  textColor?: string
  titleSize?: number
  artistSize?: number
  tracksSize?: number
}

export async function exportToPDF({ album, coverUrl, tracks, coverContrast = 0, bgColor = "#000000", bgOpacity = 50, textColor = "#ffffff", titleSize = 24, artistSize = 16, tracksSize = 14 }: ExportOptions) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [600, 848]
  })

  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 848
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, 600, 848)

  const coverY = 72
  const coverWidth = 600 - 144

  if (coverUrl) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    await new Promise<void>((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = coverUrl
    })

    const blurCanvas = document.createElement('canvas')
    blurCanvas.width = 600
    blurCanvas.height = 848
    const blurCtx = blurCanvas.getContext('2d')!
    blurCtx.filter = 'blur(4px)'
    blurCtx.drawImage(img, 72, coverY, coverWidth, coverWidth)

    ctx.drawImage(blurCanvas, 0, 0)

    if (coverContrast !== 0) {
      ctx.globalCompositeOperation = 'source-over'
    }

    ctx.globalAlpha = bgOpacity / 100
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, 600, 848)
    ctx.globalAlpha = 1

    const mainCanvas = document.createElement('canvas')
    mainCanvas.width = coverWidth
    mainCanvas.height = coverWidth
    const mainCtx = mainCanvas.getContext('2d')!
    mainCtx.drawImage(img, 0, 0, coverWidth, coverWidth)

    if (coverContrast !== 0) {
      const imageData = mainCtx.getImageData(0, 0, coverWidth, coverWidth)
      const data = imageData.data
      const factor = (259 * (coverContrast + 255)) / (255 * (259 - coverContrast))
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128))
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128))
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128))
      }
      mainCtx.putImageData(imageData, 0, 0)
    }

    ctx.drawImage(mainCanvas, 72, coverY)
  }

  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  ctx.font = `bold ${titleSize}px Georgia, serif`

  const title = album.title || 'Untitled'
  wrapText(ctx, title, 300, coverY + coverWidth + 30, 600 - 144, titleSize * 1.3)

  const artistName = album.artistCredit?.[0]?.name || album.artistCredit?.[0]?.artist?.name || ''
  if (artistName) {
    ctx.font = `${artistSize}px Georgia, serif`
    ctx.fillText(artistName, 300, coverY + coverWidth + 52)
  }

  const displayTracks = tracks.length > 0 ? tracks.slice(0, 15) : []
  if (displayTracks.length > 0) {
    ctx.font = `${tracksSize}px Georgia, serif`
    let yPos = coverY + coverWidth + 80
    displayTracks.forEach((track) => {
      const trackName = track.recording?.title || track.title || 'Untitled'
      ctx.fillText(trackName + ' · ', 300, yPos)
      yPos += tracksSize * 1.3
    })
  }

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
  pdf.addImage(dataUrl, 'JPEG', 0, 0, 600, 848)

  const filename = `${artistName || 'unknown'}-${album.title || 'poster'}`.replace(/[^a-z0-9]/gi, '-')
  pdf.save(`${filename}.pdf`)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (const word of words) {
    const testLine = line + word + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line !== '') {
      ctx.fillText(line.trim(), x, currentY)
      line = word + ' '
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, currentY)
}