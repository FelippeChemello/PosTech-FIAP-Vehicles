FROM node:24-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN apt-get update -y && apt-get install -y openssl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/api/package.json services/api/tsconfig.json ./services/api/
COPY services/api/prisma ./services/api/prisma

RUN pnpm install --filter vehicle-api...

COPY services/api ./services/api

RUN pnpm -C services/api prisma generate
RUN pnpm -C services/api build

ENV NODE_ENV=production

WORKDIR /app/services/api

EXPOSE 3000

CMD ["npm", "start"]
