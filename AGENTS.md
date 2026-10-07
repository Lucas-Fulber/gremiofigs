# AGENTS.md

Guia para agentes de IA (Claude Code, Copilot, Cursor, Codex etc.) e para humanos que trabalham neste repositório.
É a fonte única de contexto do projeto. Mantenha-o atualizado quando mudar stack, estrutura ou convenções.

## Produto

Webapp para criar **figurinhas de WhatsApp com frases da torcida gremista**: fundo nas cores tricolores com uma frase curta.

- **Fluxo:** o usuário digita a frase (ou escolhe uma pronta), escolhe o fundo, ajusta o texto e baixa/compartilha um **PNG 512×512**. Depois, ele cria a figurinha pelo criador nativo do WhatsApp.
- **Público:** torcedores, majoritariamente no celular. Por isso a UI é **mobile-first** e em **pt-BR**.
- **Arquitetura:** 100% client-side, sem backend, publicado no GitHub Pages.

### Layouts atuais
| id | Faixas (cima → baixo) | Modos de texto |
|---|---|---|
| `duo` | azul, preto | `centro` (bloco centralizado, cruza a divisa) e `distribuir` (linhas repartidas entre as faixas) |
| `trio` | azul, branco, preto | só `distribuir` (texto branco sumiria na faixa branca) |

## Stack e comandos

- **Node 24** (ver `.nvmrc`), npm, **React 19**, **Vite 8**, **TypeScript 6**, **oxlint**.
- **Fontes:** Archivo Black e Anton, auto-hospedadas via `@fontsource`.

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor local (`-- --host` para abrir no celular pela rede) |
| `npm run typecheck` | checagem de tipos (`tsc -b`) |
| `npm run lint` | oxlint |
| `npm run build` | build de produção em `dist/` |
| `npm run check` | typecheck + lint + build: **rode antes de dar uma tarefa por concluída** |

## Estrutura

```
src/
  sticker/          # núcleo de desenho: NÃO depende de React
    theme.ts        # cores, fontes, tamanho 512, margens, limites de fonte
    layouts.ts      # definição das faixas e modos de cada layout
    fitText.ts      # quebra de linha + ajuste automático da fonte (puro, sem DOM)
    render.ts       # renderSticker(ctx, options): desenha no canvas
    export.ts       # PNG (toBlob), nome do arquivo, download, Web Share
  components/       # UI React, fina: só estado e controles
  data/frases.ts    # frases prontas por categoria
  App.tsx           # estado das opções + pré-renderização do PNG
.github/workflows/deploy.yml  # CI: typecheck, lint, build e deploy no Pages (push na main)
```

## Regras e convenções

- **Lógica de desenho fica em `src/sticker/`**, sem importar React. `fitText.ts` é puro: mede texto por callback, sem acessar DOM.
  - Motivo: a Fase 2 empacota o app como nativo (Capacitor), e este núcleo será reaproveitado.
- **A saída é sempre 512×512.** A prévia escala por `devicePixelRatio`, mas a exportação não.
- **Antes de desenhar, aguarde a fonte** (`ensureFontLoaded`). Sem isso, o canvas usa a fonte de fallback.
- **Compartilhar depende do gesto do usuário:** o PNG é pré-renderizado em `App.tsx` para o `navigator.share` ser chamado logo após o toque, porque o Safari exige isso. Não troque por uma renderização síncrona no clique.
- **Sem marcas oficiais:** não use escudo, logotipo nem nome do clube como marca do app. Use só as cores. O rodapé avisa que o app é não oficial.
- **UI e textos em pt-BR**, com acentuação correta. Identificadores de código em inglês ou português, seguindo o arquivo ao redor.
- **Estilo:** sem ponto e vírgula, aspas simples, 2 espaços (ver `.editorconfig`). CSS puro em `src/index.css`, com variáveis em `:root`.
- **Acessibilidade:** controles com `label`/`legend`, rádios nativos (escondidos visualmente) e foco visível.

## Receitas

- **Novo layout:** adicione o id em `LayoutId` e a entrada em `LAYOUTS` (`src/sticker/layouts.ts`). As faixas têm altura igual. Defina `modes`, `defaultMode` e a cor padrão do texto por faixa. A UI lista automaticamente.
- **Novas frases:** edite `src/data/frases.ts`. Use frases curtas (cabem em 512px), `\n` para forçar a quebra e `layout` opcional para sugerir o fundo.
- **Nova cor ou fonte:** `COLORS` / `FONTS` em `src/sticker/theme.ts`. Fonte nova: instale `@fontsource/<nome>` e importe o CSS em `src/main.tsx`.

## Roadmap

- **Backlog web:**
  - PWA/offline.
  - Mais layouts.
  - Foto com texto.
  - Link com texto pré-preenchido.
  - Histórico local.
  - Exportar WebP < 100 KB.
  - Figurinha animada.
  - Sugestão de frases com IA.
- **Fase 2: pacotes nativos.** O app vira Android (e depois iOS) via Capacitor e registra pacotes no WhatsApp.
  - Android: `ContentProvider` + Intent `ENABLE_STICKER_PACK`. iOS: pasteboard + URL scheme.
  - Regras do WhatsApp para pacotes: 3–30 figurinhas, WebP 512×512 com até 100 KB, ícone da bandeja PNG 96×96 com até 50 KB.
  - Atenção às lojas: evitar "Grêmio" no nome do app e o escudo.
