FROM node:24-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
RUN apt-get update -y && apt-get install -y openssl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/auth/package.json services/auth/tsconfig.json ./services/auth/
COPY services/auth/prisma ./services/auth/prisma

RUN pnpm install --filter auth-service...

COPY services/auth ./services/auth

RUN cd services/auth && pnpm prisma generate
RUN cd services/auth && pnpm build

ENV NODE_ENV=production

WORKDIR /app/services/auth

EXPOSE 4000

CMD ["npm", "start"]
