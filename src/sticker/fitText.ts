/**
 * Quebra de linhas e ajuste automático do tamanho da fonte.
 *
 * Lógica pura: não acessa DOM nem canvas. A medição de texto chega por callback,
 * o que mantém este módulo reutilizável (testes, app nativo, worker).
 */

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** Tamanho de referência em que `measure` mede o texto. A largura escala linearmente com a fonte. */
export const REF_SIZE = 100

/** Largura de `text` renderizado com a fonte em `REF_SIZE` px. */
export type MeasureAtRef = (text: string) => number

export interface FitParams {
  /** Texto já transformado (maiúsculas etc.). `\n` força quebra de linha manual. */
  text: string
  /** Áreas úteis onde o texto pode ir, já sem margem. Uma área = modo centro. */
  slots: Rect[]
  measure: MeasureAtRef
  /** Altura da letra maiúscula em relação ao tamanho da fonte (ex.: 0.72). */
  capRatio: number
  lineHeight: number
  maxFontSize: number
  minFontSize: number
  /** Tamanho fixo escolhido pelo usuário. Ausente = automático. */
  fixedFontSize?: number
  maxLines?: number
}

export interface TextGroup {
  slot: number
  lines: string[]
}

export interface FitResult {
  fontSize: number
  groups: TextGroup[]
}

/** Penalidade por linha extra no modo automático: em empate, prefere menos linhas. */
const EXTRA_LINE_PENALTY = 0.03

export function fitText(params: FitParams): FitResult {
  const { text, slots, maxLines = 6 } = params
  const cache = new Map<string, number>()
  const measure: MeasureAtRef = (t) => {
    let w = cache.get(t)
    if (w === undefined) {
      w = params.measure(t)
      cache.set(t, w)
    }
    return w
  }

  const candidates = buildCandidates(text, slots.length, maxLines, measure)
  if (candidates.length === 0) return { fontSize: 0, groups: [] }

  const evaluated = candidates.map((lines) => {
    const groups = assignLines(lines, slots.length)
    return { groups, lines: lines.length, ...sizeLimits(groups, slots, measure, params) }
  })

  if (params.fixedFontSize !== undefined) {
    const size = params.fixedFontSize
    // Menor número de linhas que cabe na largura com o tamanho fixo; senão, o que menos estoura.
    const fitting = evaluated.find((c) => c.widthLimit >= size)
    const chosen = fitting ?? maxBy(evaluated, (c) => c.widthLimit)
    return { fontSize: size, groups: chosen.groups }
  }

  const chosen = maxBy(evaluated, (c) => c.size * (1 - EXTRA_LINE_PENALTY * (c.lines - 1)))
  return { fontSize: chosen.size, groups: chosen.groups }
}

/** Possíveis quebras de linha do texto, da menor para a maior quantidade de linhas. */
function buildCandidates(
  text: string,
  slotCount: number,
  maxLines: number,
  measure: MeasureAtRef,
): string[][] {
  if (text.includes('\n')) {
    const lines = text
      .split('\n')
      .map((l) => l.trim().replace(/\s+/g, ' '))
      .filter(Boolean)
    return lines.length ? [lines] : []
  }

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  // Ao distribuir, cada faixa deve receber ao menos uma linha quando houver palavras suficientes.
  const kMin = Math.min(slotCount, words.length)
  const kMax = Math.max(kMin, Math.min(words.length, maxLines))
  const candidates: string[][] = []
  for (let k = kMin; k <= kMax; k++) candidates.push(balancedBreak(words, k, measure))
  return candidates
}

/** Quebra `words` em exatamente `k` linhas, minimizando a largura da linha mais longa (DP). */
export function balancedBreak(words: string[], k: number, measure: MeasureAtRef): string[] {
  const n = words.length
  const seg = (i: number, j: number) => measure(words.slice(i, j).join(' '))

  // best[c][j] = menor largura máxima para colocar as j primeiras palavras em c linhas
  const best: number[][] = Array.from({ length: k + 1 }, () => Array(n + 1).fill(Infinity))
  const cut: number[][] = Array.from({ length: k + 1 }, () => Array(n + 1).fill(0))
  best[0][0] = 0
  for (let c = 1; c <= k; c++) {
    for (let j = c; j <= n; j++) {
      for (let i = c - 1; i < j; i++) {
        const value = Math.max(best[c - 1][i], seg(i, j))
        if (value < best[c][j]) {
          best[c][j] = value
          cut[c][j] = i
        }
      }
    }
  }

  const lines: string[] = []
  let j = n
  for (let c = k; c >= 1; c--) {
    const i = cut[c][j]
    lines.unshift(words.slice(i, j).join(' '))
    j = i
  }
  return lines
}

/** Reparte as linhas entre as áreas, de cima para baixo. */
export function assignLines(lines: string[], slotCount: number): TextGroup[] {
  const total = lines.length
  if (total === 0) return []
  if (slotCount <= 1) return [{ slot: 0, lines }]

  if (total >= slotCount) {
    const base = Math.floor(total / slotCount)
    const extra = total % slotCount
    const groups: TextGroup[] = []
    let start = 0
    for (let s = 0; s < slotCount; s++) {
      const count = base + (s < extra ? 1 : 0)
      groups.push({ slot: s, lines: lines.slice(start, start + count) })
      start += count
    }
    return groups
  }

  // Menos linhas que faixas: espalha uma linha por faixa, com espaço igual entre elas.
  if (total === 1) return [{ slot: Math.floor((slotCount - 1) / 2), lines }]
  return lines.map((line, i) => ({
    slot: Math.round((i * (slotCount - 1)) / (total - 1)),
    lines: [line],
  }))
}

function sizeLimits(
  groups: TextGroup[],
  slots: Rect[],
  measure: MeasureAtRef,
  params: FitParams,
): { size: number; widthLimit: number } {
  let widthLimit = Infinity
  let heightLimit = Infinity
  for (const group of groups) {
    const slot = slots[group.slot]
    const widest = Math.max(...group.lines.map(measure))
    if (widest > 0) widthLimit = Math.min(widthLimit, (slot.w * REF_SIZE) / widest)
    const blockHeight = (group.lines.length - 1) * params.lineHeight + params.capRatio
    heightLimit = Math.min(heightLimit, slot.h / blockHeight)
  }
  const raw = Math.min(widthLimit, heightLimit, params.maxFontSize)
  return { size: Math.max(params.minFontSize, Math.floor(raw)), widthLimit }
}

function maxBy<T>(items: T[], score: (item: T) => number): T {
  return items.reduce((best, item) => (score(item) > score(best) ? item : best))
}
