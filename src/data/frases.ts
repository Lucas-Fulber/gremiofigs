import type { LayoutId } from '../sticker/layouts'

export interface Frase {
  texto: string
  /** Layout sugerido para a frase. Ausente = mantém o layout atual. */
  layout?: LayoutId
}

export interface CategoriaFrases {
  id: string
  nome: string
  frases: Frase[]
}

/** Frases curtas: cabem bem em 512×512. Use `\n` para forçar a quebra de linha. */
export const CATEGORIAS: CategoriaFrases[] = [
  {
    id: 'zoeira',
    nome: 'Zoeira',
    frases: [
      { texto: 'Quem trabalha sexta é ganancioso' },
      { texto: 'Pegaram a churrasqueira?' },
      { texto: 'Tu sabe' },
      { texto: 'Tá louco, tchê' },
      { texto: 'Nem ferrando' },
      { texto: 'Olha ele' },
      { texto: 'Confia' },
      { texto: 'Segue o baile' },
      { texto: 'Me erra' },
    ],
  },
  {
    id: 'jogo',
    nome: 'Dia de jogo',
    frases: [
      { texto: 'Hoje tem Grêmio' },
      { texto: 'Goooool' },
      { texto: 'Vai, Grêmio!' },
      { texto: 'Segura o resultado' },
      { texto: 'Tá nervoso?' },
      { texto: 'Até a pé\nnós\niremos', layout: 'trio' },
      { texto: 'Imortal\ntricolor', layout: 'duo' },
      { texto: 'Juiz, tá de brincadeira?' },
    ],
  },
  {
    id: 'gaucho',
    nome: 'Cotidiano gaúcho',
    frases: [
      { texto: 'Bah' },
      { texto: 'Tri legal' },
      { texto: 'Mas bah, tchê' },
      { texto: 'Bora um churras?' },
      { texto: 'Chimarrão?' },
      { texto: 'Tá frio, tchê' },
      { texto: 'Baita' },
      { texto: 'Capaz!' },
    ],
  },
  {
    id: 'grenal',
    nome: 'Gre-Nal',
    frases: [
      { texto: 'Dia de Gre-Nal' },
      { texto: 'Aqui é azul' },
      { texto: 'Chora, vizinho' },
      { texto: 'Clássico é clássico' },
      { texto: 'Segunda tem zoeira' },
    ],
  },
]
