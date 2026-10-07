import { fitText, REF_SIZE, type Rect } from './fitText'
import { LAYOUTS, type LayoutId, type TextMode } from './layouts'
import {
  COLORS,
  fontString,
  LINE_GAP,
  MAX_AUTO_FONT_SIZE,
  MIN_FONT_SIZE,
  PADDING_X,
  PADDING_Y,
  STICKER_SIZE,
  type ColorName,
  type FontId,
} from './theme'

export type TextEffect = 'nenhum' | 'contorno' | 'sombra'

export interface StickerOptions {
  text: string
  layout: LayoutId
  mode: TextMode
  fontId: FontId
  uppercase: boolean
  /** `'auto'` ajusta o maior tamanho que cabe; um número fixa o tamanho em px (em 512×512). */
  fontSize: number | 'auto'
  effect: TextEffect
  /** Cor do texto no modo `centro`. */
  centerTextColor: ColorName
  /** Cor do texto em cada faixa no modo `distribuir` (mesma ordem de `layout.bands`). */
  bandTextColors: ColorName[]
}

export function prepareText(text: string, uppercase: boolean): string {
  return uppercase ? text.toLocaleUpperCase('pt-BR') : text
}

/** Garante a fonte carregada antes de desenhar; sem isso o canvas usa a fonte de fallback. */
export async function ensureFontLoaded(fontId: FontId, sample: string): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return
  await document.fonts.load(fontString(fontId, REF_SIZE), sample || 'A')
}

/**
 * Desenha a figurinha em coordenadas lógicas de `STICKER_SIZE`×`STICKER_SIZE`.
 * Quem chama cuida da escala (ex.: `devicePixelRatio` na prévia).
 */
export function renderSticker(ctx: CanvasRenderingContext2D, opts: StickerOptions): void {
  const layout = LAYOUTS[opts.layout]
  const mode = layout.modes.includes(opts.mode) ? opts.mode : layout.defaultMode
  const size = STICKER_SIZE
  const bandCount = layout.bands.length
  const bandHeight = size / bandCount

  layout.bands.forEach((band, i) => {
    // Arredonda as bordas para não sobrar linha fina entre faixas.
    const y0 = Math.round(i * bandHeight)
    const y1 = Math.round((i + 1) * bandHeight)
    ctx.fillStyle = COLORS[band.color]
    ctx.fillRect(0, y0, size, y1 - y0)
  })

  const text = prepareText(opts.text, opts.uppercase).trim()
  if (!text) return

  const padX = size * PADDING_X
  const slots: Rect[] =
    mode === 'centro'
      ? [{ x: padX, y: size * PADDING_Y, w: size - 2 * padX, h: size * (1 - 2 * PADDING_Y) }]
      : layout.bands.map((_, i) => ({
          x: padX,
          y: i * bandHeight + bandHeight * PADDING_Y,
          w: size - 2 * padX,
          h: bandHeight * (1 - 2 * PADDING_Y),
        }))

  ctx.font = fontString(opts.fontId, REF_SIZE)
  const capRatio = (ctx.measureText('H').actualBoundingBoxAscent || REF_SIZE * 0.72) / REF_SIZE
  const lineHeight = capRatio + LINE_GAP

  const { fontSize, groups } = fitText({
    text,
    slots,
    measure: (t) => ctx.measureText(t).width,
    capRatio,
    lineHeight,
    maxFontSize: MAX_AUTO_FONT_SIZE,
    minFontSize: MIN_FONT_SIZE,
    fixedFontSize: opts.fontSize === 'auto' ? undefined : opts.fontSize,
  })

  ctx.save()
  ctx.font = fontString(opts.fontId, fontSize)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.lineJoin = 'round'

  for (const group of groups) {
    const slot = slots[group.slot]
    const colorName =
      mode === 'centro'
        ? opts.centerTextColor
        : (opts.bandTextColors[group.slot] ?? layout.bands[group.slot].textColor)
    const lineStep = fontSize * lineHeight
    const capHeight = fontSize * capRatio
    const blockHeight = (group.lines.length - 1) * lineStep + capHeight
    // Centraliza pela altura da maiúscula, não pela caixa da fonte: fica visualmente no meio.
    let baseline = slot.y + slot.h / 2 - blockHeight / 2 + capHeight
    const cx = slot.x + slot.w / 2

    for (const line of group.lines) {
      drawLine(ctx, line, cx, baseline, fontSize, colorName, opts.effect)
      baseline += lineStep
    }
  }
  ctx.restore()
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  line: string,
  x: number,
  y: number,
  fontSize: number,
  colorName: ColorName,
  effect: TextEffect,
): void {
  ctx.save()
  if (effect === 'contorno') {
    ctx.strokeStyle = colorName === 'branco' ? COLORS.preto : COLORS.branco
    ctx.lineWidth = Math.max(2, fontSize * 0.14)
    ctx.strokeText(line, x, y)
  } else if (effect === 'sombra') {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.55)'
    ctx.shadowBlur = fontSize * 0.12
    ctx.shadowOffsetY = fontSize * 0.05
  }
  ctx.fillStyle = COLORS[colorName]
  ctx.fillText(line, x, y)
  ctx.restore()
}
