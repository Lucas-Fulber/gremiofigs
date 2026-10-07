import type { ColorName } from './theme'

export type LayoutId = 'duo' | 'trio'

/**
 * - `centro`: um bloco de texto centralizado na figurinha inteira (pode cruzar a divisa entre faixas).
 * - `distribuir`: as linhas são repartidas entre as faixas, cada uma centralizada na sua.
 */
export type TextMode = 'centro' | 'distribuir'

export interface Band {
  color: ColorName
  /** Cor padrão do texto quando ele fica dentro desta faixa. */
  textColor: ColorName
}

export interface LayoutDef {
  id: LayoutId
  label: string
  /** Faixas horizontais de cima para baixo, todas com a mesma altura. */
  bands: Band[]
  modes: TextMode[]
  defaultMode: TextMode
  /** Cor do texto no modo `centro`. */
  centerTextColor: ColorName
}

export const LAYOUTS: Record<LayoutId, LayoutDef> = {
  duo: {
    id: 'duo',
    label: 'Azul e preto',
    bands: [
      { color: 'azul', textColor: 'branco' },
      { color: 'preto', textColor: 'branco' },
    ],
    modes: ['centro', 'distribuir'],
    defaultMode: 'centro',
    centerTextColor: 'branco',
  },
  trio: {
    id: 'trio',
    label: 'Azul, branco e preto',
    bands: [
      { color: 'azul', textColor: 'branco' },
      { color: 'branco', textColor: 'preto' },
      { color: 'preto', textColor: 'branco' },
    ],
    // Texto branco no centro some na faixa branca: só faz sentido distribuir.
    modes: ['distribuir'],
    defaultMode: 'distribuir',
    centerTextColor: 'branco',
  },
}

export const LAYOUT_LIST: LayoutDef[] = Object.values(LAYOUTS)
