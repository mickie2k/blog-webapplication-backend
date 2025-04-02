FROM node:lts AS deps

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json .
RUN npm install

FROM node:lts AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:lts AS final

WORKDIR /app
COPY --from=builder  /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist


EXPOSE 3000

ENV NODE_ENV=production
CMD ["node", "dist/main.js"]