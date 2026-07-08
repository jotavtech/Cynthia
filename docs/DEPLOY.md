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
13. Configure SSL com Let's Encrypt (Certbot).
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

## SSL com Let's Encrypt (Certbot)

O certificado SSL de producao usa o **Let's Encrypt**, uma autoridade
certificadora gratuita e automatizada. O cliente oficial na VPS e o **Certbot**,
que emite, instala e renova o certificado direto no Nginx.

### 1. Pre-requisitos

- O dominio (`seu-dominio.com.br` e `www.seu-dominio.com.br`) deve apontar para
  o IP da VPS via registro DNS `A`/`AAAA` antes de emitir o certificado.
- As portas `80` e `443` devem estar abertas no firewall.

```bash
sudo ufw allow "Nginx Full"
```

### 2. Instalar o Certbot

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Emitir o certificado

Com o bloco Nginx da secao anterior ja ativo (respondendo em HTTP na porta 80),
rode:

```bash
sudo certbot --nginx \
  -d seu-dominio.com.br \
  -d www.seu-dominio.com.br \
  --redirect \
  --agree-tos \
  -m seu-email@dominio.com.br \
  --no-eff-email
```

O que cada opcao faz:

- `--nginx`: usa o desafio HTTP-01 e edita o bloco Nginx automaticamente.
- `--redirect`: adiciona o redirecionamento permanente de HTTP para HTTPS.
- `--agree-tos` / `-m`: aceita os termos e registra o e-mail de contato usado
  para avisos de expiracao.

Ao final, o bloco `server` passa a escutar em `443 ssl` e o Certbot cria um
segundo bloco na porta `80` apenas para redirecionar para HTTPS.

### 4. Renovacao automatica

O certificado Let's Encrypt vale **90 dias**. O pacote instala um timer do
systemd que renova automaticamente quando faltam ~30 dias. Verifique com:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

O `--dry-run` simula a renovacao sem gastar o limite de emissoes. Se ele passar,
a renovacao real vai funcionar sozinha.

### 5. Reforcos recomendados no Nginx

Depois que o Certbot ajustar o bloco `server`, adicione dentro do bloco `443` da
secao Nginx acima (o Certbot ja inclui as linhas `ssl_certificate`):

```nginx
# HSTS: forca HTTPS por 1 ano (aplique so depois de confirmar que o site
# inteiro funciona em HTTPS, pois e dificil de reverter em navegadores).
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Limite de upload alinhado com o maximo de imagem (5 MB) + folga.
client_max_body_size 8M;
```

Depois recarregue o Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

> Lembre de manter `NEXTAUTH_URL=https://seu-dominio.com.br` no `.env` de
> producao, senao sessoes e callbacks vao apontar para HTTP.

## Backup

Configure um cron diario chamando:

```bash
./scripts/backup-db.sh
```
