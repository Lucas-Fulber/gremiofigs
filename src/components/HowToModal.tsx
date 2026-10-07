import { useEffect, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export function HowToModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onClose}
      onClick={(e) => {
        // Clique no fundo escuro (fora do conteúdo) fecha o modal.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-content">
        <h2>Como virar figurinha no WhatsApp</h2>
        <ol>
          <li>
            Toque em <strong>Baixar</strong> (a imagem vai para a galeria ou para os downloads) ou em{' '}
            <strong>Compartilhar</strong>.
          </li>
          <li>No WhatsApp, abra uma conversa e toque no ícone de emoji/figurinhas.</li>
          <li>
            Vá na aba de figurinhas e toque em <strong>Criar</strong> (ou no <strong>+</strong>).
          </li>
          <li>Escolha a imagem que você baixou, ajuste se quiser e envie.</li>
          <li>
            Para guardar: toque na figurinha enviada e em <strong>Adicionar às favoritas</strong>.
          </li>
        </ol>
        <p className="muted">
          Funciona no Android, no iPhone e no WhatsApp Web/Desktop. O caminho pode mudar um pouco
          conforme a versão do WhatsApp.
        </p>
        <button type="button" className="button primary" onClick={onClose}>
          Entendi
        </button>
      </div>
    </dialog>
  )
}
