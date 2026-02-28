# multi-stage build to handle pnpm workspace

# builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# copy root package files and workspace config
# copy package files and workspace config (lockfile may be missing in some build contexts)
COPY package.json pnpm-workspace.yaml ./
COPY backend/package.json backend/

# ensure curl is available and fetch pnpm-lock.yaml from the repo if it's not present in the build context
RUN apk add --no-cache curl || true
RUN if [ ! -f pnpm-lock.yaml ]; then \
		echo "pnpm-lock.yaml not found in context — fetching from GitHub"; \
		curl -fsSL https://raw.githubusercontent.com/kalkalkida/agriconnect2/main/pnpm-lock.yaml -o pnpm-lock.yaml || echo "warning: could not fetch pnpm-lock.yaml"; \
	else \
		echo "pnpm-lock.yaml present in context"; \
	fi

# install pnpm and workspace dependencies
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --prefer-offline || pnpm install --prefer-offline

# copy remaining source files
COPY . .

# run any necessary build (frontend) if needed
RUN pnpm run build

# runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# copy only built output and node_modules from builder
COPY --from=builder /app .

# install pnpm for pruning (and later runtime commands)
RUN npm install -g pnpm@latest

# ensure production dependencies only
ENV CI=true
RUN pnpm prune --prod

EXPOSE 3000

# start backend
CMD ["pnpm", "--filter", "agriconnect-backend", "start"]
