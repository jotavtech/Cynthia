# Cynthia Makes V2

Reconstrucao do Cynthia Makes do zero: loja/catalogo de maquiagem com site
publico, carrinho com finalizacao via WhatsApp e painel administrativo seguro.

Este repositorio nao reaproveita codigo do projeto antigo. A base atual cobre a
Fase 1: setup, arquitetura inicial, Prisma, documentacao, `.env.example`, seed
e primeira base visual.

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

1. Setup, Prisma, docs, estrutura e base visual.
2. Banco e autenticacao admin.
3. Admin base com CRUD e upload.
4. Site publico conectado a dados reais.
5. Carrinho e WhatsApp.
6. Estoque, vendas e auditoria.
7. Deploy em VPS Hostinger.
8. QA e polimento.

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
