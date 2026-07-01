# Cynthia Makes V2

Reconstrucao do Cynthia Makes do zero: loja/catalogo de maquiagem com site
publico, carrinho com finalizacao via WhatsApp e painel administrativo seguro.

Este repositorio nao reaproveita codigo do projeto antigo. Alem da fundacao
(Fase 1), ja estao implementados: autenticacao admin com sessao assinada,
painel administrativo com CRUD de produtos, categorias, marcas e configuracoes,
upload de imagens no Cloudinary, site publico conectado ao banco, carrinho
persistente e finalizacao pelo WhatsApp, alem de pedidos, controle de estoque
com historico e auditoria de acoes.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma ORM
- PostgreSQL
- Zod
- React Hook Form
- Lucide React

## Requisitos

- Node.js LTS
- npm
- PostgreSQL

## Configuracao local

```bash
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Preencha `.env` antes de rodar migrations ou seed.

## Variaveis de ambiente

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
STORE_WHATSAPP=
```

`ADMIN_PASSWORD` deve ter pelo menos 12 caracteres. Nunca use senha real no
codigo e nunca commite `.env`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:studio
npm run db:seed
```

## Estrutura

```txt
app/
  admin/login/
  carrinho/
  contato/
  produtos/
  sobre/
components/
  admin/
  cart/
  forms/
  layout/
  product/
  public/
  ui/
docs/
lib/
  auth/
  db/
  validations/
prisma/
scripts/
```

## Fases

1. [x] Setup, Prisma, docs, estrutura e base visual.
2. [x] Banco e autenticacao admin (sessao assinada com `jose`, protecao de rotas via `proxy.ts`).
3. [x] Admin base com CRUD (produtos, categorias, marcas, configuracoes) e upload no Cloudinary.
4. [x] Site publico conectado a dados reais (home, catalogo com busca/filtro, pagina de produto).
5. [x] Carrinho persistente e finalizacao pelo WhatsApp.
6. [x] Estoque, vendas e auditoria (pedidos persistidos no checkout, painel de pedidos com status e baixa de estoque, movimentacoes de estoque com historico e auditoria).
7. [ ] Deploy em VPS Hostinger (guia pronto em `docs/DEPLOY.md`).
8. [ ] QA e polimento.

## Autenticacao

O login admin usa hash `bcrypt` e uma sessao stateless assinada (JWT HS256 via
`jose`) guardada em cookie `HttpOnly`. As rotas `/admin` sao pre-filtradas em
`proxy.ts` e revalidadas no Data Access Layer (`lib/auth/dal.ts`) proximo aos
dados. O segredo vem de `NEXTAUTH_SECRET` (minimo de 32 caracteres).

## Seguranca

- Nao commitar secrets.
- Nao criar bypass de login.
- Nao expor dashboard admin sem autenticacao.
- Nao salvar senha em texto puro.
- Validar entradas no servidor.
- Rodar lint, typecheck e build antes de deploy.

Leia tambem:

- `docs/SECURITY.md`
- `docs/DATABASE.md`
- `docs/DEPLOY.md`
- `docs/ADMIN_GUIDE.md`
