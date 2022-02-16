FROM --platform=linux/amd64 node:16 as installer
WORKDIR /app
COPY ./client/package*.json /app/
RUN npm ci
COPY ./client/ /app/

FROM --platform=linux/amd64 node:16 as linter
WORKDIR /app
COPY --from=installer /app/ /app/
RUN npm run lint --if-present

FROM --platform=linux/amd64 node:16 as tester
WORKDIR /app
COPY --from=installer /app/ /app/
RUN npm run test --if-present

FROM --platform=linux/amd64 node:16 as builder
WORKDIR /app
COPY --from=installer /app/ /app/
RUN npm run build

FROM --platform=linux/amd64 node:16 as releaser
WORKDIR /app
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=${GITHUB_TOKEN}
RUN git config --global user.name "github action"
RUN git config --global user.email action@github.com
RUN git clone https://${GITHUB_TOKEN}@github.com/whattheearl/jearl.io .
RUN git fetch --tags https://${GITHUB_TOKEN}@github.com/whattheearl/jearl.io
WORKDIR /app/client
RUN npm ci
RUN npm run release

FROM nginx:1.20-alpine as server
EXPOSE 80
COPY --from=builder /app/out/ /usr/share/nginx/html
