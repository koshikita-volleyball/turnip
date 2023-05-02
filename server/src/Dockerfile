FROM public.ecr.aws/lambda/nodejs:18
COPY . .
RUN npm install -g yarn
RUN yarn install
RUN yarn tsc
