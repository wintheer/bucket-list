FROM node:22 AS base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
EXPOSE 3000

FROM base AS build
COPY . .
RUN yarn build

FROM node:22 AS prod
WORKDIR /app
COPY --from=build /app/.output ./output
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "output/server/index.mjs"]
