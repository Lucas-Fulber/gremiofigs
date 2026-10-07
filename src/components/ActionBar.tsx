import { useState } from 'react'
import { canShareFiles, downloadBlob, shareOrDownload } from '../sticker/export'

interface Props {
  /** Devolve o PNG atual; a App mantém um pré-renderizado para o compartilhar não perder o gesto do usuário. */
  getBlob: () => Promise<Blob>
  fileName: string
  disabled: boolean
  onHowTo: () => void
}

const SHARE_SUPPORTED = canShareFiles()

export function ActionBar({ getBlob, fileName, disabled, onHowTo }: Props) {
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function run(action: 'baixar' | 'compartilhar') {
    setBusy(true)
    setStatus(null)
    try {
      const blob = await getBlob()
      if (action === 'baixar') {
        downloadBlob(blob, fileName)
        setStatus('Imagem baixada! Agora é só criar a figurinha no WhatsApp.')
      } else {
        const result = await shareOrDownload(blob, fileName)
        if (result === 'baixado') setStatus('Compartilhar não disponível: a imagem foi baixada.')
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Algo deu errado ao gerar a imagem.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="actions">
      <div className="actions-buttons">
        {SHARE_SUPPORTED && (
          <button
            type="button"
            className="button primary"
            disabled={disabled || busy}
            onClick={() => run('compartilhar')}
          >
            Compartilhar
          </button>
        )}
        <button
          type="button"
          className={`button ${SHARE_SUPPORTED ? 'secondary' : 'primary'}`}
          disabled={disabled || busy}
          onClick={() => run('baixar')}
        >
          Baixar PNG
        </button>
      </div>
      <button type="button" className="link" onClick={onHowTo}>
        Como virar figurinha no WhatsApp?
      </button>
      {status && (
        <p className="status" role="status">
          {status}
        </p>
      )}
    </div>
  )
}
