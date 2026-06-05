# Banco de Dados

O projeto usa PostgreSQL com Prisma.

## Entidades iniciais

- User
- Product
- ProductImage
- Category
- Brand
- Order
- OrderItem
- InventoryTransaction
- AuditLog
- SiteSettings

## Comandos

```bash
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
```

## Seed

O seed cria:

- usuario admin via env;
- categorias iniciais;
- marcas iniciais;
- configuracoes iniciais do site.

Produtos reais devem ser cadastrados pelo painel quando a area administrativa
for implementada.
