import { useEffect, useRef } from 'react'
import { ensureFontLoaded, prepareText, renderSticker, type StickerOptions } from '../sticker/render'
import { fontString, STICKER_SIZE } from '../sticker/theme'

interface Props {
  options: StickerOptions
}

export function StickerPreview({ options }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false

    const draw = () => {
      if (cancelled) return
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      const px = Math.round(STICKER_SIZE * dpr)
      if (canvas.width !== px) {
        canvas.width = px
        canvas.height = px
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, STICKER_SIZE, STICKER_SIZE)
      renderSticker(ctx, options)
    }

    const sample = prepareText(options.text, options.uppercase)
    // Só desenha na hora se a fonte já está pronta; senão espera, para não piscar a fonte de fallback.
    if (document.fonts?.check(fontString(options.fontId, 100), sample || 'A')) draw()
    ensureFontLoaded(options.fontId, sample).then(draw, draw)

    return () => {
      cancelled = true
    }
  }, [options])

  return (
    <canvas
      ref={canvasRef}
      className="preview"
      role="img"
      aria-label={options.text ? `Prévia da figurinha: ${options.text}` : 'Prévia da figurinha'}
    />
  )
}
