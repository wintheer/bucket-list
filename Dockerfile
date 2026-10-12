FROM node:22 AS base

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --immutable

FROM base AS build

COPY . .

RUN yarn build


FROM node:22 AS prod

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]