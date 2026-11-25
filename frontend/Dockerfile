FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

# Dev
FROM base AS development

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Production
FROM base AS production-deps

RUN npm ci

FROM base AS production-build

COPY --from=production-deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM nginx:alpine AS production

COPY --from=production-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
