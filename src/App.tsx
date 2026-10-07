import { useCallback, useEffect, useRef, useState } from 'react'
import { ActionBar } from './components/ActionBar'
import { HowToModal } from './components/HowToModal'
import { LayoutPicker } from './components/LayoutPicker'
import { PhrasePicker } from './components/PhrasePicker'
import { StickerPreview } from './components/StickerPreview'
import { TextInput } from './components/TextInput'
import { TextOptions } from './components/TextOptions'
import type { Frase } from './data/frases'
import { renderToBlob, stickerFileName } from './sticker/export'
import { LAYOUTS, type LayoutId } from './sticker/layouts'
import type { StickerOptions } from './sticker/render'

const INITIAL_OPTIONS: StickerOptions = {
  text: 'Quem trabalha sexta é ganancioso',
  layout: 'duo',
  mode: LAYOUTS.duo.defaultMode,
  fontId: 'archivo',
  uppercase: true,
  fontSize: 'auto',
  effect: 'nenhum',
  centerTextColor: LAYOUTS.duo.centerTextColor,
  bandTextColors: LAYOUTS.duo.bands.map((b) => b.textColor),
}

/** Troca de layout: mantém o modo se o novo layout suportar e volta as cores do texto ao padrão. */
function withLayout(options: StickerOptions, layoutId: LayoutId): StickerOptions {
  const layout = LAYOUTS[layoutId]
  return {
    ...options,
    layout: layoutId,
    mode: layout.modes.includes(options.mode) ? options.mode : layout.defaultMode,
    centerTextColor: layout.centerTextColor,
    bandTextColors: layout.bands.map((b) => b.textColor),
  }
}

export default function App() {
  const [options, setOptions] = useState<StickerOptions>(INITIAL_OPTIONS)
  const [howToOpen, setHowToOpen] = useState(false)

  const update = useCallback((patch: Partial<StickerOptions>) => {
    setOptions((prev) => ({ ...prev, ...patch }))
  }, [])

  // Mantém um PNG pronto: o Safari só deixa abrir o compartilhamento logo após o toque,
  // e gerar a imagem na hora pode passar desse limite.
  const prerendered = useRef<{ options: StickerOptions; blob: Blob } | null>(null)
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      renderToBlob(options).then(
        (blob) => {
          if (!cancelled) prerendered.current = { options, blob }
        },
        () => {},
      )
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [options])

  const getBlob = useCallback(async () => {
    const cached = prerendered.current
    return cached?.options === options ? cached.blob : renderToBlob(options)
  }, [options])

  function pickPhrase(frase: Frase) {
    setOptions((prev) => {
      const base = frase.layout ? withLayout(prev, frase.layout) : prev
      return { ...base, text: frase.texto }
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Figurinhas Tricolores</h1>
        <p>Escreva a frase, baixe a imagem e crie a figurinha no WhatsApp.</p>
      </header>

      <main className="app-main">
        <div className="preview-column">
          <div className="preview-frame">
            <StickerPreview options={options} />
          </div>
          <ActionBar
            getBlob={getBlob}
            fileName={stickerFileName(options.text)}
            disabled={!options.text.trim()}
            onHowTo={() => setHowToOpen(true)}
          />
        </div>

        <div className="controls-column">
          <TextInput value={options.text} onChange={(text) => update({ text })} />
          <LayoutPicker
            layout={options.layout}
            mode={options.mode}
            onLayoutChange={(layout) => setOptions((prev) => withLayout(prev, layout))}
            onModeChange={(mode) => update({ mode })}
          />
          <PhrasePicker onPick={pickPhrase} />
          <TextOptions options={options} onChange={update} />
        </div>
      </main>

      <footer className="app-footer">
        App de torcedor, não oficial. Sem vínculo com o clube.
      </footer>

      <HowToModal open={howToOpen} onClose={() => setHowToOpen(false)} />
    </div>
  )
}
