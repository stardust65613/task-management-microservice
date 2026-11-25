FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Dev
FROM base AS development

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && npm run dev"]

# Production
FROM base AS production-deps

RUN npm ci

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=production-deps /app/node_modules ./node_modules

COPY . .

RUN npx prisma generate

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
