# Figurinhas Tricolores

Webapp para criar figurinhas de WhatsApp com frases da torcida gremista: fundo azul e preto (ou azul, branco e preto) e texto branco centralizado.

1. Escreva a frase ou escolha uma pronta.
2. Escolha o fundo e ajuste o texto (fonte, tamanho, contorno/sombra, cores).
3. Toque em **Compartilhar** (celular) ou **Baixar PNG**.
4. No WhatsApp: figurinhas → **Criar** → escolha a imagem.

> App de torcedor, **não oficial** e sem vínculo com o clube. Não usamos escudo nem marcas oficiais, só as cores.

## Rodando localmente

Requer Node 24 (ver `.nvmrc`).

```bash
npm install
npm run dev            # http://localhost:5173
npm run dev -- --host  # para testar no celular pela rede local
npm run check          # typecheck + lint + build
```

## Publicação (GitHub Pages)

O workflow `.github/workflows/deploy.yml` faz o build e publica a cada push na `main`. No GitHub, ative uma vez: **Settings → Pages → Source: GitHub Actions**.

O build usa caminhos relativos (`base: './'`), então funciona com qualquer nome de repositório.

## Requisitos técnicos

- **Arquitetura:** 100% no navegador, com canvas 2D. Exporta PNG 512×512, o tamanho de figurinha do WhatsApp.
- **Compartilhamento:** usa a Web Share API com arquivos (Chrome Android, Safari iOS 15+). Sem suporte, faz download.
- **Fontes:** auto-hospedadas (`@fontsource`), carregadas antes de desenhar.

## Para quem desenvolve (e para agentes de IA)

Contexto completo, convenções e roadmap: [AGENTS.md](AGENTS.md). O [CLAUDE.md](CLAUDE.md) importa esse arquivo.
