# Seguranca

## Principios obrigatorios

- Nao commitar secrets.
- Nao criar bypass de login.
- Nao expor rotas administrativas sem sessao.
- Nao salvar senha em texto puro.
- Validar dados no servidor com Zod.
- Proteger upload por tipo e tamanho.
- Nao logar senha, token, API secret ou string completa de banco.

## Auth

A Fase 2 deve implementar login admin com hash de senha, sessao segura,
logout, expiracao e protecao de rotas.

## Upload

Tipos aceitos:

- JPG/JPEG
- PNG
- WEBP

Limite inicial recomendado: 5 MB.

## Deploy

Producao deve rodar com HTTPS e `.env` seguro. Antes de publicar, rode:

```bash
npm run lint
npm run typecheck
npm run build
```
