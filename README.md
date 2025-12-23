# Plataforma de revenda de veiculos - Fase 3 FIAP Arquitetura de Softwre

Backend em Node.js (v24) com TypeScript, pnpm, PostgreSQL e Prisma. A solução e dividida em dois serviços:

- `services/auth`: serviço de autenticação.
- `services/api`: API de veículos e vendas.

## Requisitos

- Node.js v24
- pnpm
- Docker e Docker Compose

## Como rodar localmente

1) Suba os bancos PostgreSQL:

```bash
docker compose up -d
```

2) Configure as variáveis de ambiente.

`services/auth/.env`

```bash
AUTH_PORT=4000
AUTH_BASE_URL=http://localhost:4000
AUTH_SECRET=uma-chave-forte
AUTH_DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
```

`services/api/.env`

```bash
API_PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/vehicle_api
AUTH_SERVICE_URL=http://localhost:4000
```

3) Instale as dependencias:

```bash
pnpm install
```

4) Rode migrations do Prisma:

```bash
cd services/auth
pnpm prisma migrate dev

cd services/api
pnpm prisma migrate dev
```

5) Suba os servicos:

```bash
docker compose up -d
pnpm dev
```

## Fluxo de autenticacao

O servico de autenticacao expõe as rotas padrao do better-auth em `/auth/*` e gera tokens de acesso.
Use essas rotas para cadastrar/login de compradores e obtenha o token para comprar veiculos.

## Endpoints principais (API de veiculos)

- `POST /vehicles` cria veiculo
- `PUT /vehicles/:id` edita veiculo (somente se nao vendido)
- `GET /vehicles/available` lista veículos a venda por preço (asc)
- `GET /vehicles/sold` lista veículos vendidos por preço (asc)
- `POST /vehicles/:id/purchase` compra veiculo (requer `Authorization: Bearer <token>`)

## Utilizando os serviços

Instale a extensão REST Client no VSCode para testar os endpoints. Use o arquivo `api.rest` na raiz do projeto como exemplo de requisições.