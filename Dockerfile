FROM node:24-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install

COPY src/ ./src
COPY public/ ./public
COPY rsbuild.config.ts tsconfig.json ./

ENV NODE_ENV=production

RUN --mount=type=cache,target=/app/.rsbuild \
    pnpm build