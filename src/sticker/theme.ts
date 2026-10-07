/** Tamanho padrão de figurinha do WhatsApp (quadrada). A exportação sai sempre neste tamanho. */
export const STICKER_SIZE = 512

export const COLORS = {
  azul: '#1BA0E2',
  preto: '#000000',
  branco: '#FFFFFF',
} as const

export type ColorName = keyof typeof COLORS

export const COLOR_LABELS: Record<ColorName, string> = {
  azul: 'Azul',
  preto: 'Preto',
  branco: 'Branco',
}

export const FONTS = {
  archivo: { family: 'Archivo Black', weight: 400, label: 'Archivo Black' },
  anton: { family: 'Anton', weight: 400, label: 'Anton (condensada)' },
} as const

export type FontId = keyof typeof FONTS

/** Fontes de emoji de cada sistema, usadas como fallback por glifo. */
const EMOJI_FALLBACK = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'

export function fontString(fontId: FontId, sizePx: number): string {
  const { family, weight } = FONTS[fontId]
  return `${weight} ${sizePx}px "${family}", ${EMOJI_FALLBACK}`
}

/**
 * Folga entre o pé de uma linha e o topo da maiúscula da seguinte, em múltiplos do tamanho da fonte.
 * O passo entre linhas é `altura da maiúscula + LINE_GAP`, então fontes altas (Anton) ganham
 * espaço proporcional e os acentos (Ê, Á) não encostam na linha de cima.
 */
export const LINE_GAP = 0.42

/** Margem lateral, em fração do lado da figurinha. */
export const PADDING_X = 0.08

/** Margem vertical dentro de cada área de texto, em fração da altura da área. */
export const PADDING_Y = 0.1

/** Teto do tamanho automático, para o fundo continuar aparecendo em textos curtos. */
export const MAX_AUTO_FONT_SIZE = 110

export const MIN_FONT_SIZE = 16
