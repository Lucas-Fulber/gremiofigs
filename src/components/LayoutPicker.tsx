import { LAYOUT_LIST, LAYOUTS, type LayoutId, type TextMode } from '../sticker/layouts'
import { COLORS } from '../sticker/theme'
import { Segmented } from './Segmented'

interface Props {
  layout: LayoutId
  mode: TextMode
  onLayoutChange: (layout: LayoutId) => void
  onModeChange: (mode: TextMode) => void
}

const MODE_LABELS: Record<TextMode, string> = {
  centro: 'Centralizado',
  distribuir: 'Uma linha por faixa',
}

export function LayoutPicker({ layout, mode, onLayoutChange, onModeChange }: Props) {
  const current = LAYOUTS[layout]

  return (
    <fieldset className="field">
      <legend className="field-label">Fundo</legend>
      <div className="layout-options" role="radiogroup">
        {LAYOUT_LIST.map((def) => (
          <label key={def.id} className={`layout-option${def.id === layout ? ' is-active' : ''}`}>
            <input
              type="radio"
              name="layout"
              value={def.id}
              checked={def.id === layout}
              onChange={() => onLayoutChange(def.id)}
            />
            <span className="layout-swatch" aria-hidden="true">
              {def.bands.map((band, i) => (
                <span key={i} style={{ background: COLORS[band.color] }} />
              ))}
            </span>
            <span>{def.label}</span>
          </label>
        ))}
      </div>

      {current.modes.length > 1 && (
        <Segmented
          name="modo"
          value={mode}
          options={current.modes.map((m) => ({ value: m, label: MODE_LABELS[m] }))}
          onChange={onModeChange}
        />
      )}
    </fieldset>
  )
}
