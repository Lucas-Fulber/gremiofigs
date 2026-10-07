export const MAX_TEXT_LENGTH = 60

interface Props {
  value: string
  onChange: (value: string) => void
}

export function TextInput({ value, onChange }: Props) {
  return (
    <div className="field">
      <label htmlFor="texto" className="field-label">
        Frase
      </label>
      <textarea
        id="texto"
        rows={3}
        maxLength={MAX_TEXT_LENGTH}
        value={value}
        placeholder="Ex.: Quem trabalha sexta é ganancioso"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="field-hint">
        <span>Enter quebra a linha. Sem quebra, o app escolhe sozinho.</span>
        <span aria-live="polite">
          {value.length}/{MAX_TEXT_LENGTH}
        </span>
      </div>
    </div>
  )
}
