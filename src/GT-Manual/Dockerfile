FROM node:lts-slim AS runtime

WORKDIR /workspace/GT-Manual

COPY . .

RUN npm install

ENTRYPOINT [ "node", "app" ]