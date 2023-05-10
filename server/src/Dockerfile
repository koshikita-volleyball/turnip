FROM node:18 as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn compile
RUN rm -rf node_modules/ && rm -rf *.ts

FROM public.ecr.aws/lambda/nodejs:18 as production
ENV NODE_ENV production
RUN npm install --global yarn
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY --from=build /app/ ./
