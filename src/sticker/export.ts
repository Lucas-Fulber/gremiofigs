import { ensureFontLoaded, prepareText, renderSticker, type StickerOptions } from './render'
import { STICKER_SIZE } from './theme'

/** Renderiza a figurinha em 512×512 e devolve o PNG. */
export async function renderToBlob(opts: StickerOptions): Promise<Blob> {
  await ensureFontLoaded(opts.fontId, prepareText(opts.text, opts.uppercase))

  const canvas = document.createElement('canvas')
  canvas.width = STICKER_SIZE
  canvas.height = STICKER_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D indisponível neste navegador.')
  renderSticker(ctx, opts)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar a imagem.'))), 'image/png')
  })
}

/** `figurinha-gremio-<slug>.png`, sem acentos nem caracteres especiais. */
export function stickerFileName(text: string): string {
  const slug = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '')
  return `figurinha-gremio${slug ? `-${slug}` : ''}.png`
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Dá tempo para o navegador iniciar o download antes de liberar a URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** O navegador consegue compartilhar arquivos de imagem (folha de compartilhamento do celular)? */
export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false
  try {
    return navigator.canShare({ files: [new File([''], 'teste.png', { type: 'image/png' })] })
  } catch {
    return false
  }
}

export type ShareResult = 'compartilhado' | 'cancelado' | 'baixado'

/** Abre a folha de compartilhamento; sem suporte, cai para download. */
export async function shareOrDownload(blob: Blob, fileName: string): Promise<ShareResult> {
  const file = new File([blob], fileName, { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return 'compartilhado'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelado'
      // Outros erros (ex.: permissão negada): segue para o download.
    }
  }
  downloadBlob(blob, fileName)
  return 'baixado'
}
