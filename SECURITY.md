# Política de segurança

## Como reportar uma vulnerabilidade

Encontrou um problema de segurança? **Não abra uma issue pública.** Use o
[reporte privado de vulnerabilidades do GitHub](https://github.com/Lucas-Fulber/gremiofigs/security/advisories/new).
A resposta vem em até 7 dias.

## O que o app faz (superfície de ataque)

- Roda 100% no navegador: não há backend, login, banco de dados nem cookies.
- Não coleta dados pessoais. O texto digitado e as imagens geradas ficam no aparelho do usuário.
- Publicado na Vercel com headers de segurança (CSP restritiva, HSTS, `X-Frame-Options`, `Permissions-Policy` etc.), definidos em `vercel.json`.
- Dependências monitoradas pelo Dependabot e auditadas no CI (`npm audit`).
