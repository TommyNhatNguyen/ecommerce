FROM node:20 AS development
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install
COPY . .
EXPOSE 3002
CMD ["yarn", "dev"]


FROM node:20 AS production
WORKDIR /app/backend
COPY package.json yarn.lock ./app/backend
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3002
CMD ["yarn", "start"]
