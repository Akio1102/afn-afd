FROM node:24-slim

RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*


ENV COREPACK_HOME=/home/node/.cache/corepack
ENV COREPACK_ENABLE_DOWNLOADS=1

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN mkdir -p /home/node/.cache/corepack && chown -R node:node /home/node/.cache

WORKDIR /workspace

USER node