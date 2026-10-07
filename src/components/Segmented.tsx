interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  name: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}

/** Grupo de botões de rádio com visual de abas. */
export function Segmented<T extends string>({ name, value, options, onChange }: Props<T>) {
  return (
    <div className="segmented" role="radiogroup">
      {options.map((opt) => (
        <label key={opt.value} className={opt.value === value ? 'is-active' : undefined}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={opt.value === value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}
