# Deploy em VPS Hostinger

Este guia cobre o caminho recomendado para publicar o Cynthia Makes em uma VPS
Hostinger com PostgreSQL, Nginx, SSL e backup basico.

## Variaveis obrigatorias

Copie `.env.example` para `.env` no servidor e preencha valores reais:

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

Nunca commite `.env`.

## Passos

1. Conecte na VPS via SSH.
2. Instale Node.js LTS e npm.
3. Instale PostgreSQL ou configure um banco externo.
4. Clone o repositorio.
5. Crie o `.env` com secrets fortes.
6. Rode `npm ci`.
7. Rode `npm run db:generate`.
8. Rode `npm run db:deploy`.
9. Rode `npm run db:seed`.
10. Rode `npm run build`.
11. Suba com PM2 ou Docker Compose.
12. Configure Nginx como reverse proxy.
13. Configure SSL com Certbot.
14. Teste dominio, login, catalogo, carrinho e upload.
15. Configure backup com `scripts/backup-db.sh`.

## PM2

```bash
npm install -g pm2
pm2 start npm --name cynthia-makes -- start
pm2 save
pm2 startup
```

## Nginx

```nginx
server {
  server_name seu-dominio.com.br www.seu-dominio.com.br;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## SSL

```bash
sudo certbot --nginx -d seu-dominio.com.br -d www.seu-dominio.com.br
```

## Backup

Configure um cron diario chamando:

```bash
./scripts/backup-db.sh
```
