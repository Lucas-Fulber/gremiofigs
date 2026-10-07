import { useState } from 'react'
import { CATEGORIAS, type Frase } from '../data/frases'

interface Props {
  onPick: (frase: Frase) => void
}

export function PhrasePicker({ onPick }: Props) {
  const [categoriaId, setCategoriaId] = useState(CATEGORIAS[0].id)
  const categoria = CATEGORIAS.find((c) => c.id === categoriaId) ?? CATEGORIAS[0]

  return (
    <section className="field" aria-labelledby="frases-titulo">
      <h2 id="frases-titulo" className="field-label">
        Frases prontas
      </h2>
      <div className="chips" role="tablist">
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === categoriaId}
            className={`chip${c.id === categoriaId ? ' is-active' : ''}`}
            onClick={() => setCategoriaId(c.id)}
          >
            {c.nome}
          </button>
        ))}
      </div>
      <ul className="phrases" role="tabpanel">
        {categoria.frases.map((frase) => (
          <li key={frase.texto}>
            <button type="button" className="phrase" onClick={() => onPick(frase)}>
              {frase.texto.replace(/\n/g, ' ')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
