FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Dev
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production
FROM base AS production-deps

RUN npm ci

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
