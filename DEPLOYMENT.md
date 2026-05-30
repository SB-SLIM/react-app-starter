# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
WORKDIR /app
RUN npm install -g turbo@latest
COPY . .
RUN turbo prune server --docker

FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
COPY scripts/ ./scripts/
COPY tsconfig.base.json ./
RUN pnpm turbo build --filter=server...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 fastify
COPY --from=builder /app /build
RUN cd /build && pnpm --filter=server deploy --prod --legacy /app

# TODO: Add ESM import fix here (Option A, B, or C above)

RUN chown -R fastify:nodejs /app
USER fastify
EXPOSE 3001
CMD ["node", "dist/server.js"]
