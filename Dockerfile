# multi-stage build to handle pnpm workspace

# builder stage
FROM node:20-alpine AS builder

WORKDIR /app

# copy root package files and workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/

# install pnpm
RUN npm install -g pnpm@latest

# install dependencies for entire workspace (frontend + backend)
RUN pnpm install --frozen-lockfile --prefer-offline

# copy remaining source files
COPY . .

# run any necessary build (frontend) if needed
RUN pnpm run build

# runtime stage
FROM node:20-alpine AS runtime
WORKDIR /app

# copy only built output and node_modules from builder
COPY --from=builder /app .

# ensure production dependencies only
RUN pnpm prune --prod

EXPOSE 3000

# start backend
CMD ["pnpm", "--filter", "agriconnect-backend", "start"]
