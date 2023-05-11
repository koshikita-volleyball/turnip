FROM public.ecr.aws/lambda/nodejs:18 as production
RUN npm install --global yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn compile
