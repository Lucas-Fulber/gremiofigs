import { LAYOUTS } from '../sticker/layouts'
import type { StickerOptions, TextEffect } from '../sticker/render'
import { COLOR_LABELS, COLORS, FONTS, type ColorName, type FontId } from '../sticker/theme'
import { Segmented } from './Segmented'

interface Props {
  options: StickerOptions
  onChange: (patch: Partial<StickerOptions>) => void
}

const EFFECTS: { value: TextEffect; label: string }[] = [
  { value: 'nenhum', label: 'Nenhum' },
  { value: 'contorno', label: 'Contorno' },
  { value: 'sombra', label: 'Sombra' },
]

/** Tamanho inicial (px em 512×512) ao desligar o automático. */
const MANUAL_DEFAULT_SIZE = 80

const BAND_NAMES =['Faixa de cima', 'Faixa do meio', 'Faixa de baixo']

export function TextOptions({ options, onChange }: Props) {
  const layout = LAYOUTS[options.layout]
  const isAuto = options.fontSize === 'auto'

  return (
    <fieldset className="field">
      <legend className="field-label">Texto</legend>

      <div className="option-row">
        <label htmlFor="fonte">Fonte</label>
        <select
          id="fonte"
          value={options.fontId}
          onChange={(e) => onChange({ fontId: e.target.value as FontId })}
        >
          {(Object.keys(FONTS) as FontId[]).map((id) => (
            <option key={id} value={id}>
              {FONTS[id].label}
            </option>
          ))}
        </select>
      </div>

      <label className="option-row checkbox">
        <input
          type="checkbox"
          checked={options.uppercase}
          onChange={(e) => onChange({ uppercase: e.target.checked })}
        />
        Tudo maiúsculo
      </label>

      <div className="option-row">
        <label className="checkbox">
          <input
            type="checkbox"
            checked={isAuto}
            onChange={(e) => onChange({ fontSize: e.target.checked ? 'auto' : MANUAL_DEFAULT_SIZE })}
          />
          Tamanho automático
        </label>
      </div>
      {!isAuto && (
        <div className="option-row">
          <label htmlFor="tamanho">Tamanho</label>
          <input
            id="tamanho"
            type="range"
            min={24}
            max={200}
            step={2}
            value={options.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="option-row stacked">
        <span>Efeito</span>
        <Segmented
          name="efeito"
          value={options.effect}
          options={EFFECTS}
          onChange={(effect) => onChange({ effect })}
        />
      </div>

      {options.mode === 'centro' ? (
        <ColorRow
          label="Cor do texto"
          name="cor-centro"
          value={options.centerTextColor}
          onChange={(centerTextColor) => onChange({ centerTextColor })}
        />
      ) : (
        layout.bands.map((band, i) => (
          <ColorRow
            key={`${layout.id}-${i}`}
            label={layout.bands.length === 2 ? BAND_NAMES[i * 2] : BAND_NAMES[i]}
            name={`cor-faixa-${i}`}
            value={options.bandTextColors[i] ?? band.textColor}
            exclude={band.color}
            onChange={(color) => {
              const next = [...options.bandTextColors]
              next[i] = color
              onChange({ bandTextColors: next })
            }}
          />
        ))
      )}
    </fieldset>
  )
}

interface ColorRowProps {
  label: string
  name: string
  value: ColorName
  /** Cor do fundo da faixa: texto da mesma cor sumiria. */
  exclude?: ColorName
  onChange: (color: ColorName) => void
}

function ColorRow({ label, name, value, exclude, onChange }: ColorRowProps) {
  const colors = (Object.keys(COLORS) as ColorName[]).filter((c) => c !== exclude)
  return (
    <div className="option-row">
      <span>{label}</span>
      <div className="swatches" role="radiogroup" aria-label={label}>
        {colors.map((c) => (
          <label key={c} className={`swatch${c === value ? ' is-active' : ''}`} title={COLOR_LABELS[c]}>
            <input type="radio" name={name} checked={c === value} onChange={() => onChange(c)} />
            <span style={{ background: COLORS[c] }} />
            <span className="sr-only">{COLOR_LABELS[c]}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
